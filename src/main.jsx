// Import necessary modules and components
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import store from './app/store'
import { Provider } from 'react-redux'

// Create the root element and render the App component wrapped with StrictMode and Redux Provider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </StrictMode>,
)
