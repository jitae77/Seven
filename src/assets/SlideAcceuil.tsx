import React, { useState, useEffect } from "react";
import "./SlideAcceuil.css";
import { dataSeven } from "./DataSeven";

const SlideAccueil: React.FC = () => {
  const [slides] = useState(() =>
    [...dataSeven].sort(() => Math.random() - 0.5).slice(0, 5)
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const changeSlide = (next: boolean) => {
    setPrevIndex(activeIndex);
    setActiveIndex((prev) =>
      next ? (prev + 1) % slides.length : (prev - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => changeSlide(true), 8000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="slider-content">
      {slides.map((slide, index) => {
        let className = "slide-main";
        if (index === activeIndex) className += " active";
        else if (index === prevIndex) className += " exit";

        return (
          <div
            key={slide.id}
            className={className}
            style={{
              backgroundImage: slide.image ? `url(${slide.image})` : undefined,
              backgroundColor: "#222", 
            }}
          >
            <div className="overlay"></div>
            <div className="image-caption">
              <span className="line"></span>
              <span>{slide.titre}</span>
            </div>
            <div className="title-wrapper">
              <p>{slide.description}</p>
              <a href={slide.lien} className="gallery">
                Visionnez
              </a>
            </div>
          </div>
        );
      })}

      <div className="dots-nav">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => {
              setPrevIndex(activeIndex);
              setActiveIndex(index);
            }}
          ></span>
        ))}
      </div>

      <button className="nav-btn prev" onClick={() => changeSlide(false)}>‹</button>
      <button className="nav-btn next" onClick={() => changeSlide(true)}>›</button>
    </div>
  );
};

export default SlideAccueil;
