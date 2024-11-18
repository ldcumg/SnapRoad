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
      className='fixed left-0 top-0 z-[5000] flex h-full w-full items-center justify-center bg-black bg-opacity-70'
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
