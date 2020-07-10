import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "& > .MuiTextField-root": {
            width: "100%",
            fontSize: 12,
        }
    },
    
}));

const CommentForm = ({postId, setComments}) => {
    const classes = useStyles();
    const [comment, setComment] = useState({text: ""});

    const handleChange = e => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        });
    }

    const postComment = e => {
        e.preventDefault();

        if(comment.text){
            Axios.post(`/api/posts/${postId}/comments`, comment)
                .then(() => {
                    Axios.get(`/api/posts/${postId}/comments`)
                        .then(res => {
                            setComments(res.data);
                        })
                        .catch(err => console.log(err.message, err.response));
                    setComment({text: ""});
                })
                .catch(err => console.log(err.message, err.response));
        }
    }

    return (
        <form className = {classes.root} onSubmit = {postComment}>
            <TextField id="text" name = "text" type = "text" value = {comment.text} onChange={handleChange} label="Enter a Comment..." variant="outlined" size = "small" multiline/>
            <Button type = "submit">Send</Button>
        </form>
    );
};

export default CommentForm;