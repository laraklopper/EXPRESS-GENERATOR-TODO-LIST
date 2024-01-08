import React from 'react'; // Import the React module to use React functionalities
import ReactDOM from 'react-dom/client';
import './index.css';//Import CSS stylesheet
import App from './App';//Import the app function in App.js file
import reportWebVitals from './reportWebVitals';//Import reportWebVitals function from './reportWebVitals' to measure performance metrics 
import { BrowserRouter } from "react-router-dom";//Import browserrouter

// Create a root for rendering the React app using the element id
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root using ReactDOM
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
