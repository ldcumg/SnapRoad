import { AreaPixedType, unCroppedImg } from '@/types/CropTypes';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Cropper from 'react-easy-crop';

type Props = {
  unCroppedImage: unCroppedImg;
  setCroppedAreaPixels: Dispatch<SetStateAction<AreaPixedType>>;
  cropperModal: boolean;
  handleCropImage: () => void;
};

const ImageCropper = ({ unCroppedImage, setCroppedAreaPixels, cropperModal, handleCropImage }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea: AreaPixedType, croppedAreaPixels: AreaPixedType) => {
    console.log('Cropped Area Pixels: ', croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels); // Update cropped area pixels
  };

  if (!cropperModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ position: 'relative', width: '80%', height: '80%' }}>
        <Cropper
          image={unCroppedImage as string}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropShape='rect'
        />
        <button
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            padding: '10px 20px',
            backgroundColor: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCropImage();
          }}
        >
          자르기
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
