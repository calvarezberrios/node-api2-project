import React, { useState, useEffect } from 'react';
import PostCard from "./PostCard";
import axios from "axios";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/posts")
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.log(err.message, err.response));
    }, []);

    return (
        <div className = "posts-container">
            {posts.map(post => <PostCard key = {post.id} post = {post} />)}
        </div>
    );
};

export default Posts;