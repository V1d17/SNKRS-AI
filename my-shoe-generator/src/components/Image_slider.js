import React from 'react';
import './image_slider.css';
const ImageList = ({ images }) => {
  if (!images || images.length === 0) {
    return<div className="empty-message">
    <div className="typing-container">
      <p className="typing-animation">Start Generating.</p>
    </div>
  </div>;
  }

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div className="image-item" key={index}>
          <img src={image} alt='shoe' />
        </div>
      ))}
    </div>
  );
}

export default ImageList;