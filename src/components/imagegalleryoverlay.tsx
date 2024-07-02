import React, { useState, useRef, useEffect } from 'react';
import Portal from './portal';
import styles from './imagegalleryoverlay.module.css';

interface ImageGalleryOverlayProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const ImageGalleryOverlay: React.FC<ImageGalleryOverlayProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Portal zIndex={1100}>
      <div className={styles.overlayContainer}>
        <div className={styles.overlay} ref={overlayRef}>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
          <div className={styles.imageContainer}>
            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className={styles.image} />
            <div className={styles.arrowButtonContainer}>
              <button onClick={handlePrev} className={styles.arrowButton}>←</button>
              <button onClick={handleNext} className={styles.arrowButton}>→</button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ImageGalleryOverlay;
