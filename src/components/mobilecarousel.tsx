import React from 'react';
import styles from './mobilecarouselstyle.module.css';

interface CarouselProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselInnerContainer}>
        <button onClick={handlePrev} className={styles.arrowButton}>←</button>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className={styles.carouselImage}
          onClick={() => onImageClick(currentIndex)}
        />
        <button onClick={handleNext} className={styles.arrowButton}>→</button>
      </div>
    </div>
  );
};

export default Carousel;
