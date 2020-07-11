import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from "./components/AppBar";
import Posts from './components/Posts';
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("/api/posts")
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.log(err.message, err.response));
    }, []);

  return (
    <div className="App">
      <AppBar posts = {posts} setPosts = {setPosts} />
      <Posts posts = {posts} setPosts = {setPosts} />
    </div>
  );
}

export default App;
