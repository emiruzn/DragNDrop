import React, { useState } from 'react';
import './InputField.css';

// InputField component with dynamic resizing
const InputField = ({id, value, onFieldChange}) => {
  const [text, setText] = useState(value || '');
  const maxChars = 100; // Set the maximum number of characters

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    onFieldChange(e);
  };

  return (
    <div className="input-field-container">
      <textarea
        value={text}
        onChange={handleInputChange}
        rows="1"
      />
    </div>
  );
};

export default InputField;