import React, { useState } from 'react';
import './MainApp.css';
import ImageUpload from '../elements/ImageUpload';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import FeaturePanel from './FeaturePanel';

const MainApp = ({ onLogout }) => {
  const [components] = useState(['Image Upload', 'Input Field', 'Checkbox']);
  const [droppedComponents, setDroppedComponents] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [featurePanel, setFeaturePanel] = useState({
    isOpen: false,
    componentId: null,
    position: { x: 0, y: 0 },
  });

  const handleDelete = (id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.filter((comp) => comp.id !== featurePanel.componentId)
    );
    closeFeaturePanel();
  };

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', component);
    e.dataTransfer.setData('type', 'new');
    e.dataTransfer.setData('offsetX', 0);
    e.dataTransfer.setData('offsetY', 0);
  };

  const handleDragStartExisting = (e, component) => {
    e.dataTransfer.setData('component', component);
    e.dataTransfer.setData('type', 'existing');

    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    e.dataTransfer.setData('offsetX', offsetX);
    e.dataTransfer.setData('offsetY', offsetY);
  };

  const handleDrag = (e, id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, isDragging: true } : comp
      )
    );
  };
  
  const handleDragEnd = (e, id) => {
    setDroppedComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, isDragging: false } : comp
      )
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const component = e.dataTransfer.getData('component');
    const type = e.dataTransfer.getData('type');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX'), 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY'), 10);

    if (!component || !type || isNaN(offsetX) || isNaN(offsetY)) {
      console.error('Invalid drop data');
      return;
    }

    if (type === 'new') {
      const newComponent = {
        id: Date.now(),
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

  const allowDrop = (e) => {
    e.preventDefault();
  };



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

  const closeFeaturePanel = () => {
    setFeaturePanel({ isOpen: false, componentId: null, position: { x: 0, y: 0 } });
  };


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
        return <InputField />;
      case 'Checkbox':
        return <Checkbox />;
      default:
        return null;
    }
  };

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
          // Implement custom logic here
          if (component.events?.customScript) {
            try {
              // Use Function for safer script execution
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
        <button onClick={onLogout}>Logout</button>
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
