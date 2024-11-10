// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

// Import styles and components
import './index.css';
import App from './App';
import { store } from './redux/store';

// Create and render the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap the app in StrictMode for additional checks and warnings
  <React.StrictMode>
    {/* Provide Redux store to the entire app */}
    <Provider store={store}>
      {/* Set up routing for the app */}
      <Router>
        {/* Render the main App component */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
);
