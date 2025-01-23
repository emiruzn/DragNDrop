import React, { useState } from 'react';
import './InputField.css';

const InputField = () => {
  const [text, setText] = useState('');
  const maxChars = 100; // Set the maximum number of characters

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
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