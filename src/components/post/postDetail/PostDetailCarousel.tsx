'use client';

import '../../../styles/postDetail.css';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import React, { useState } from 'react';

interface PostDetailCarouselProps {
  images: (string | undefined)[];
}

const AdaptiveHeight: KeenSliderPlugin = (slider) => {
  function updateHeight() {
    slider.container.style.height = slider.slides[slider.track.details.rel].offsetHeight + 'px';
  }
  slider.on('created', updateHeight);
  slider.on('slideChanged', updateHeight);
};

const PostDetailCarousel = ({ images }: PostDetailCarouselProps) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [AdaptiveHeight],
  );

  return (
    <>
      <div className='navigation-wrapper'>
        <div
          ref={sliderRef}
          className='keen-slider'
        >
          {images.map((image, index) => (
            <div
              key={index}
              className='keen-slider__slide'
              style={{
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',
              }}
            />
          ))}
        </div>
      </div>
      {loaded && instanceRef.current && (
        <div className='dots'>
          {/* {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => { */}
          {Array.from({ length: instanceRef.current.track.details.slides.length }, (_, idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={'dot' + (currentSlide === idx ? ' active' : '')}
              ></button>
            );
          })}
        </div>
      )}
    </>
  );
};

function Arrow(props: { disabled: boolean; left?: boolean; onClick: (e: any) => void }) {
  const disabled = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${props.left ? 'arrow--left' : 'arrow--right'} ${disabled}`}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      {props.left && <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />}
      {!props.left && <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />}
    </svg>
  );
}
export default PostDetailCarousel;
