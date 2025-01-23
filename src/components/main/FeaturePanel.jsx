import React, { useEffect, useRef } from 'react';
import './FeaturePanel.css';

const FeaturePanel = ({
  position,
  component,
  onClose,
  onUpdate,
}) => {
  const panelRef = useRef(null);

  // Close the feature panel when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  if (!component) return null;

  const handleInputChange = (field, value) => {
    onUpdate(field, value);
  };

  return (
    <div
      className="feature-panel"
      ref={panelRef}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: 'absolute',
      }}
    >
      <h4>Properties</h4>
      <label>
        Left:
        <input
          type="number"
          value={component.left}
          onChange={(e) => handleInputChange('left', parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Top:
        <input
          type="number"
          value={component.top}
          onChange={(e) => handleInputChange('top', parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Width:
        <input
          type="number"
          value={component.width}
          onChange={(e) => handleInputChange('width', parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={component.height}
          onChange={(e) => handleInputChange('height', parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Background Color:
        <input
          type="color"
          value={component.backgroundColor}
          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
        />
      </label>
      <label>
        Border Color:
        <input
          type="color"
          value={component.borderColor}
          onChange={(e) => handleInputChange('borderColor', e.target.value)}
        />
      </label>
    </div>
  );
};

export default FeaturePanel;
