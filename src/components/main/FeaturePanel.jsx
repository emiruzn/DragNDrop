import React, { useEffect, useRef, useState } from 'react';
import './FeaturePanel.css';


// FeaturePanel component for editing properties of dropped components
const FeaturePanel = ({
  position,
  component,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const panelRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger visibility with animation
  useEffect(() => {
    if (component) {
      setIsVisible(true);
    }
  }, [component]);

  // Close the feature panel when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay to match the CSS animation
  };

  if (!component) return null;

  const handleInputChange = (field, value) => {
    onUpdate(field, value);
  };

  const handleEventChange = (event, action) => {
    const updatedEvents = {
      ...component.events,
      [event]: action,
    };
    onUpdate('events', updatedEvents);
  };

  const handleScriptChange = (event) => {
    const updatedEvents = {
      ...component.events,
      customScript: event.target.value,
    };
    onUpdate('events', updatedEvents);
  };

  return (
    <div
      className={`feature-panel ${isVisible ? 'open' : 'close'}`}
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

      {/* Event settings */}
      <h4>Events</h4>
      <label>
        On Click:
        <select
          value={component.events?.onClick || ''}
          onChange={(e) => handleEventChange('onClick', e.target.value)}
        >
          <option value="">None</option>
          <option value="alert">Show Alert</option>
          <option value="log">Log to Console</option>
          <option value="custom">Custom Action</option>
        </select>
      </label>

      {component.events?.onClick === 'custom' && (
        <label>
          Custom Script:
          <textarea
            value={component.events?.customScript || ''}
            onChange={handleScriptChange}
            placeholder="Enter your custom script here"
            rows={4}
            style={{
              width: '100%',
              padding: '5px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
            }}
          ></textarea>
        </label>
      )}

      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default FeaturePanel;
