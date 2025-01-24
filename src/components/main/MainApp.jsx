import React, { useState, useEffect } from 'react';
import './MainApp.css';
import ImageUpload from '../elements/ImageUpload';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import FeaturePanel from './FeaturePanel';

// MainApp component for the main application interface
const MainApp = ({ onLogout }) => {
  
  const [components] = useState(['Image Upload', 'Input Field', 'Checkbox']); // State to manage available components
  const [droppedComponents, setDroppedComponents] = useState([]); // State to manage components dropped onto the canvas
  const [uploadedImages, setUploadedImages] = useState({}); // State for uploaded images associated with components
  const [inputFieldValues, setInputFieldValues] = useState({}); // State for input field values
  const [checkedBoxes, setCheckedBoxes] = useState({}); // State for checkbox states
  
  // State to manage the feature panel (properties editor) for a selected component
  const [featurePanel, setFeaturePanel] = useState({
    isOpen: false,
    componentId: null,
    position: { x: 0, y: 0 },
  });

  // Deletes a component by ID
  const handleDelete = (id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.filter((comp) => comp.id !== featurePanel.componentId)
    );
    closeFeaturePanel(); // Close the feature panel after deletion
  };

  // Handles dragging of new components from the left panel
  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', component);
    e.dataTransfer.setData('type', 'new'); // Indicates a new component is being dragged
    e.dataTransfer.setData('offsetX', 0);
    e.dataTransfer.setData('offsetY', 0);
  };

  // Handles dragging of existing components on the canvas
  const handleDragStartExisting = (e, component) => {
    e.dataTransfer.setData('component', component);
    e.dataTransfer.setData('type', 'existing'); // Indicates an existing component is being dragged

    // Calculate the offset between the mouse pointer and the component's top-left corner
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offsetX', offsetX);
    e.dataTransfer.setData('offsetY', offsetY);
  };

  // Temporarily marks the component as being dragged (for styling purposes)
  const handleDrag = (e, id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, isDragging: true } : comp
      )
    );
  };

  // Resets dragging state when drag ends
  const handleDragEnd = (e, id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, isDragging: false } : comp
      )
    );
  };

  // Handles dropping of components onto the canvas
  const handleDrop = (e) => {
    e.preventDefault();
    const component = e.dataTransfer.getData('component'); // Component type
    const type = e.dataTransfer.getData('type'); // Whether the component is new or existing
    const offsetX = parseInt(e.dataTransfer.getData('offsetX'), 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY'), 10);

    // Validate the drop data
    if (!component || !type || isNaN(offsetX) || isNaN(offsetY)) {
      console.error('Invalid drop data');
      return;
    }

    if (type === 'new') {
      // Add a new component to the canvas
      const newComponent = {
        id: Date.now(), // Generate a unique ID
        type: component,
        left: e.clientX - e.target.getBoundingClientRect().left - offsetX,
        top: e.clientY - e.target.getBoundingClientRect().top - offsetY,
        width: 100,
        height: 100,
        backgroundColor: '#ffffff',
        borderColor: '#000000',
      };
      setDroppedComponents([...droppedComponents, newComponent]);
    } else if (type === 'existing') {
      // Update position of an existing component
      const id = parseInt(component, 10);
      const updatedComponents = droppedComponents.map((comp) => {
        if (comp.id === id) {
          return {
            ...comp,
            left: e.clientX - e.target.getBoundingClientRect().left - offsetX,
            top: e.clientY - e.target.getBoundingClientRect().top - offsetY,
          };
        }
        return comp;
      });
      setDroppedComponents(updatedComponents);
    }
  };

  // Allows the canvas to accept dropped elements
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Handles right-click to open the feature panel
  const handleRightClick = (e, componentId) => {
    e.preventDefault();
    const component = droppedComponents.find((comp) => comp.id === componentId);
    setFeaturePanel({
      isOpen: true,
      componentId,
      position: { x: e.clientX, y: e.clientY },
      component,
    });
  };

  // Updates properties of the selected component via the feature panel
  const handleFeatureChange = (field, value) => {
    setDroppedComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === featurePanel.componentId) {
          return { ...comp, [field]: value };
        }
        return comp;
      })
    );
  };

  // Closes the feature panel
  const closeFeaturePanel = () => {
    setFeaturePanel({ isOpen: false, componentId: null, position: { x: 0, y: 0 } });
  };

  // Dynamically renders the appropriate component type
  const renderComponent = (comp) => {
    switch (comp.type) {
      case 'Image Upload':
        return (
          <ImageUpload
            id={comp.id}
            image={uploadedImages[comp.id]}
            onImageChange={(id, image) =>
              setUploadedImages((prev) => ({ ...prev, [id]: image }))
            }
          />
        );
      case 'Input Field':
        return (
          <InputField
            id={comp.id}
            value={inputFieldValues[comp.id] || ''}
            onFieldChange={(e) =>
              setInputFieldValues((prev) => ({ ...prev, [comp.id]: e.target.value }))
            }
          />
        );
      case 'Checkbox':
        return (
          <Checkbox
            id={comp.id}
            checked={checkedBoxes[comp.id] || false}
            onCheckChange={(e) =>
              setCheckedBoxes((prev) => ({ ...prev, [comp.id]: e.target.checked }))
            }
          />
        );
      default:
        return null;
    }
  };

  // Handles click events for components and executes predefined actions
  const handleComponentClick = (e, id) => {
    const component = droppedComponents.find((comp) => comp.id === id);
    if (component.events?.onClick) {
      switch (component.events.onClick) {
        case 'alert':
          alert('Component clicked!');
          break;
        case 'log':
          console.log('Component clicked:', component);
          break;
        case 'custom':
          // Execute a custom script if provided
          if (component.events?.customScript) {
            try {
              const customFunction = new Function(component.events.customScript);
              customFunction();
            } catch (error) {
              console.error('Error executing custom script:', error);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  // Saves the current canvas state to localStorage
  const saveToLocalStorage = () => {
    const state = {
      droppedComponents,
      uploadedImages,
      checkedBoxes,
      inputFieldValues,
    };
    localStorage.setItem('canvasState', JSON.stringify(state));
  };

  // Loads the canvas state from localStorage
  const loadFromLocalStorage = () => {
    try {
      const state = JSON.parse(localStorage.getItem('canvasState'));
      if (
        state &&
        Array.isArray(state.droppedComponents) &&
        typeof state.uploadedImages === 'object' &&
        typeof state.checkedBoxes === 'object' &&
        typeof state.inputFieldValues === 'object'
      ) {
        setDroppedComponents(state.droppedComponents);
        setUploadedImages(state.uploadedImages);
        setCheckedBoxes(state.checkedBoxes);
        setInputFieldValues(state.inputFieldValues);
      } else {
        console.warn('Invalid state data in localStorage');
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  };

  return (
    <div className="main-app">
      {/* Left Panel */}
      <div className="left-panel">
        <h3>Components</h3>
        <ul>
          {components.map((component, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="draggable-item"
            >
              {component}
            </li>
          ))}
        </ul>

        <div className="button-container">
          <button onClick={saveToLocalStorage}>Save</button>
          <button onClick={loadFromLocalStorage}>Load</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Design Canvas */}
      <div className="canvas" onDrop={handleDrop} onDragOver={allowDrop}>
        {droppedComponents.map((comp) => (
          <div
            key={comp.id}
            className="dropped-component"
            style={{
              left: `${comp.left}px`,
              top: `${comp.top}px`,
              width: `${comp.width}px`,
              height: `${comp.height}px`,
              backgroundColor: comp.backgroundColor,
              border: `2px solid ${comp.borderColor}`,
              position: 'absolute',
              borderRadius: '10%',
              visibility: comp.isDragging ? 'hidden' : 'visible',
            }}
            draggable
            onDragStart={(e) => handleDragStartExisting(e, comp.id)}
            onDrag={(e) => handleDrag(e, comp.id)}
            onDragEnd={(e) => handleDragEnd(e, comp.id)}
            onContextMenu={(e) => handleRightClick(e, comp.id)}
            onClick={(e) => handleComponentClick(e, comp.id)}
          >
            {renderComponent(comp)}
          </div>
        ))}
      </div>

      {/* Feature Panel */}
      {featurePanel.isOpen && (
        <FeaturePanel
          position={featurePanel.position}
          component={droppedComponents.find((comp) => comp.id === featurePanel.componentId)}
          onClose={closeFeaturePanel}
          onUpdate={handleFeatureChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MainApp;
