import React from 'react';
import './App.css';
import AppBar from "./components/AppBar";
import Posts from './components/Posts';

function App() {
  return (
    <div className="App">
      <AppBar />
      <Posts />
    </div>
  );
}

export default App;
