"use client"

import { useCallback, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import { AbstractOverlay, MapMarker } from "react-kakao-maps-sdk";

const TooltipMarker = ({ position }) => {
  // Marker로 올려질 node 객체를 생성 합니다.
  const node = useRef(document.createElement('div'));
  const [isTackerVisible, setIsTrackerVisible] = useState(false);
  const [tracerPosition, setTracerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [tracerAngle, setTracerAngle] = useState(0);

  const positionLatlng = useMemo(() => {
    return new kakao.maps.LatLng(position.lat, position.lng);
  }, [position.lat, position.lng]);

  function onAdd() {
    const panel = this.getPanels().overlayLayer;
    panel.appendChild(node.current);
  }

  function onRemove() {
    node.current.parentNode.removeChild(node.current);
  }

  function draw() {
    const projection = this.getProjection();
    const point = projection.pointFromCoords(positionLatlng);

    const width = node.current.offsetWidth;
    const height = node.current.offsetHeight;

    node.current.style.left = point.x - width / 2 + 'px';
    node.current.style.top = point.y - height / 2 + 'px';
  }

  const OUTCODE = {
    INSIDE: 0, // 0b0000
    TOP: 8, //0b1000
    RIGHT: 2, // 0b0010
    BOTTOM: 4, // 0b0100
    LEFT: 1, // 0b0001
  };

  const BOUNDS_BUFFER = 30;

  const CLIP_BUFFER = 40;

  const Tracker = ({ position, angle }) => {
    return (
      <div
        className={'tracker'}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={() => {
          map.current.setCenter(positionLatlng);
          setIsTrackerVisible(false);
        }}
      >
        <div
          className={'balloon'}
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        ></div>
        <div className={'icon'}></div>
      </div>
    );
  };

  const getClipPosition = useCallback(
    (top, right, bottom, left, inner, outer) => {
      const calcOutcode = (x, y) => {
        let outcode = OUTCODE.INSIDE;

        if (x < left) {
          outcode |= OUTCODE.LEFT;
        } else if (x > right) {
          outcode |= OUTCODE.RIGHT;
        }

        if (y < top) {
          outcode |= OUTCODE.TOP;
        } else if (y > bottom) {
          outcode |= OUTCODE.BOTTOM;
        }

        return outcode;
      };

      let ix = inner.x;
      let iy = inner.y;
      let ox = outer.x;
      let oy = outer.y;

      let code = calcOutcode(ox, oy);

      while (true) {
        if (!code) {
          break;
        }

        if (code & OUTCODE.TOP) {
          ox = ox + ((ix - ox) / (iy - oy)) * (top - oy);
          oy = top;
        } else if (code & OUTCODE.RIGHT) {
          oy = oy + ((iy - oy) / (ix - ox)) * (right - ox);
          ox = right;
        } else if (code & OUTCODE.BOTTOM) {
          ox = ox + ((ix - ox) / (iy - oy)) * (bottom - oy);
          oy = bottom;
        } else if (code & OUTCODE.LEFT) {
          oy = oy + ((iy - oy) / (ix - ox)) * (left - ox);
          ox = left;
        }

        code = calcOutcode(ox, oy);
      }

      return { x: ox, y: oy };
    },
    [OUTCODE.BOTTOM, OUTCODE.INSIDE, OUTCODE.LEFT, OUTCODE.RIGHT, OUTCODE.TOP],
  );

  const getAngle = (center, target) => {
    const dx = target.x - center.x;
    const dy = center.y - target.y;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

    return ((-deg + 360) % 360 | 0) + 90;
  };

  // target의 위치를 추적하는 함수
  const tracking = useCallback(() => {
    const proj = map.current.getProjection();

    // 지도의 영역을 구합니다.
    const bounds = map.current.getBounds();

    // 지도의 영역을 기준으로 확장된 영역을 구합니다.
    const extBounds = extendBounds(bounds, proj);

    // target이 확장된 영역에 속하는지 판단하고
    if (extBounds.contain(positionLatlng)) {
      // 속하면 tracker를 숨깁니다.
      setIsTrackerVisible(false);
    } else {
      const pos = proj.containerPointFromCoords(positionLatlng);
      const center = proj.containerPointFromCoords(map.current.getCenter());
      const sw = proj.containerPointFromCoords(bounds.getSouthWest());
      const ne = proj.containerPointFromCoords(bounds.getNorthEast());

      const top = ne.y + CLIP_BUFFER;
      const right = ne.x - CLIP_BUFFER;
      const bottom = sw.y - CLIP_BUFFER;
      const left = sw.x + CLIP_BUFFER;

      const clipPosition = getClipPosition(top, right, bottom, left, center, pos);

      setTracerPosition(clipPosition);

      const angle = getAngle(center, pos);

      setTracerAngle(angle);

      setIsTrackerVisible(true);
    }
  }, [getClipPosition, map.current, positionLatlng]);

  const hideTracker = useCallback(() => {
    setIsTrackerVisible(false);
  }, []);

  useEffect(() => {
    node.current.style.position = 'absolute';
    node.current.style.whiteSpace = 'nowrap';
  }, []);

  const extendBounds = (bounds, proj) => {
    const sw = proj.pointFromCoords(bounds.getSouthWest());
    const ne = proj.pointFromCoords(bounds.getNorthEast());

    // 확장을 위해 각 좌표에 BOUNDS_BUFFER가 가진 수치만큼 더하거나 빼줍니다.
    sw.x -= BOUNDS_BUFFER;
    sw.y += BOUNDS_BUFFER;

    ne.x += BOUNDS_BUFFER;
    ne.y -= BOUNDS_BUFFER;

    return new kakao.maps.LatLngBounds(proj.coordsFromPoint(sw), proj.coordsFromPoint(ne));
  };

  useEffect(() => {
    setFocus(searchInput);
    kakao.maps.event.addListener(map.current, 'zoom_start', hideTracker);
    kakao.maps.event.addListener(map.current, 'zoom_changed', tracking);
    kakao.maps.event.addListener(map.current, 'center_changed', tracking);
    tracking();

    return () => {
      kakao.maps.event.removeListener(map.current, 'zoom_start', hideTracker);
      kakao.maps.event.removeListener(map.current, 'zoom_changed', tracking);
      kakao.maps.event.removeListener(map.current, 'center_changed', tracking);
      setIsTrackerVisible(false);
    };
  }, [map.current, hideTracker, tracking]);

  return (
    <>
      <AbstractOverlay
        onAdd={onAdd}
        onRemove={onRemove}
        draw={draw}
      />
      {isTackerVisible ? (
        ReactDOM.createPortal(
          <Tracker
            position={tracerPosition}
            angle={tracerAngle}
          />,
          map.current.getNode(),
        )
      ) : (
        // ReactDOM.createPortal(
        //     <Marker tooltipText={tooltipText} />,
        //     node.current,
        //   )
        <MapMarker
          position={position}
          onClick={() => {
            if (!map.current) return;
            map.current.setLevel(5, { animate: true });
            map.current.panTo(new kakao.maps.LatLng(position.lat, position.lng));
          }}
          draggable={true}
          onDragEnd={(map) => console.log(map.getPosition())}
        />
      )}
    </>
  );
};