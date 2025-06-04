import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  alt: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(`https://via.placeholder.com/800x600?text=${encodeURIComponent(alt)}`);
    }
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;
