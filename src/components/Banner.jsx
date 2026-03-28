import React, { useState, useEffect, useRef } from 'react';
import './Banner.css';

const slides = [
  {
    type: 'slide1',
    badge: { prefix: 'Flat ', highlight: '30%', suffix: ' Off' },
    title: 'New Launch',
    subtitle: 'Strollers, car seats & Much more',
    images: [
      { src: 'banner1.jpg', alt: 'Pink stroller' },
      { src: 'banner2.jpg', alt: 'Blue stroller' },
      { src: 'banner3.jpg', alt: 'Car seat' },
    ],
  },
  {
    type: 'slide2',
    badge: { prefix: 'Flat ', highlight: '30%', suffix: ' Off' },
    title: 'Baby Beds &\nAccessories',
    leftImage: { src: 'beds.jpg', alt: 'Baby beds' },
    rightImage: { src: 'accessories.jpg', alt: 'Baby accessories' },
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setCurrent((index + slides.length) % slides.length);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePrev = () => { goTo(current - 1); resetTimer(); };
  const handleNext = () => { goTo(current + 1); resetTimer(); };

  return (
    <div className="bz-banner">
      <div
        className="bz-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) =>
          slide.type === 'slide1' ? (
            <div className="bz-slide bz-slide1" key={i}>
              <div className="bz-s1-imgs">
                {slide.images.map((img, j) => (
                  <div className="bz-s1-img" key={j}>
                    <img src={img.src} alt={img.alt} />
                  </div>
                ))}
              </div>
              <div className="bz-s1-text">
                <div className="bz-badge">
                  {slide.badge.prefix}
                  <span>{slide.badge.highlight}</span>
                  {slide.badge.suffix}
                </div>
                <div className="bz-s1-title">{slide.title}</div>
                <div className="bz-s1-sub">{slide.subtitle}</div>
                <button className="bz-btn">Shop Now</button>
              </div>
            </div>
          ) : (
            <div className="bz-slide bz-slide2" key={i}>
              <img className="bz-s2-left" src={slide.leftImage.src} alt={slide.leftImage.alt} />
              <div className="bz-s2-diagonal">
                <div className="bz-s2-badge">
                  {slide.badge.prefix}
                  <span>{slide.badge.highlight}</span>
                  {slide.badge.suffix}
                </div>
                <div className="bz-s2-title">{slide.title}</div>
                <button className="bz-btn bz-btn-small">Shop Now</button>
              </div>
              <img className="bz-s2-right" src={slide.rightImage.src} alt={slide.rightImage.alt} />
            </div>
          )
        )}
      </div>

      <button className="bz-arr bz-arr-l" onClick={handlePrev}>&#8249;</button>
      <button className="bz-arr bz-arr-r" onClick={handleNext}>&#8250;</button>

      <div className="bz-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`bz-dot${i === current ? ' active' : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;