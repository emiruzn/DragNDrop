import React, { useEffect, useRef } from 'react';
import './Checkbox.css';

const Checkbox = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const updateScaleFactor = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        // Calculate scale factor based on the smallest dimension
        const scaleFactor = Math.min(containerWidth, containerHeight) / Math.max(containerWidth, containerHeight);

        containerRef.current.style.setProperty('--scale-factor', scaleFactor);
      }
    };

    // Use ResizeObserver for dynamic resizing
    const resizeObserver = new ResizeObserver(updateScaleFactor);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateScaleFactor(); // Initial calculation

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="checkbox-container" ref={containerRef}>
      <label>
        <input type="checkbox" />
      </label>
    </div>
  );
};

export default Checkbox;
