import React from 'react';
import PostCard from "./PostCard";

const Posts = ({posts, setPosts}) => {

    return (
        <div className = "posts-container">
            {posts.map(post => <PostCard key = {post.id} post = {post} posts = {posts} setPosts = {setPosts} />)}
        </div>
    );
};

export default Posts;