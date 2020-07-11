import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from "@material-ui/core/TextField";

import Axios from 'axios';
import CommentForm from './CommentForm';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function RecipeReviewCard({post, posts, setPosts}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [comments, setComments] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [postToEdit, setPostToEdit] = useState(post);

    const handleChange = e => {
        setPostToEdit({
            ...postToEdit,
            [e.target.name]: e.target.value
        });
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const editPost = e => {

        if(!isEditing){
            e.target.textContent = "Save";
        } else {
            Axios.put(`/api/posts/${post.id}`, postToEdit)
                .then(() => {
                    setPosts(posts.map(post => {
                        if(post.id === postToEdit.id) {
                            return postToEdit;
                        }
                        return post;
                    }));
                })
                .catch(err => console.log(err.message, err.response.data));

            e.target.textContent = "Edit";
        }
        setIsEditing(!isEditing);
        handleClose();
    }

    const deletePost = () => {
        
        const confirmed = window.confirm("Are you sure you want to delete this post?");

        if(confirmed) {
            Axios.delete(`/api/posts/${post.id}`)
                .then(() => {
                    setPosts(posts.filter(p => p.id !== post.id));
                })
                .catch(err => console.log(err.message, err.response));
        }
        handleClose();
    }

    useEffect(() => {
        Axios.get(`/api/posts/${post.id}/comments`)
            .then(res => {
                setComments(res.data);
            })
            .catch(err => console.log(err.message, err.response));
    }, [post.id]);

    return (
        <Card className={classes.root + " post-card"}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {post.id}
                    </Avatar>
                }
                action={<>
                    <IconButton aria-label="options" aria-controls = "simple-menu" aria-haspopup = "true" onClick = {handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={editPost}>Edit</MenuItem>
                        <MenuItem onClick={deletePost}>Delete</MenuItem>
                    </Menu>
                </>}
                title={!isEditing ? post.contents : <TextField id = "contents" multiline variant = "outlined" type = "text" label = "Title" name = "contents" value = {postToEdit.contents} onChange = {handleChange} />}
                subheader={post.created_at}
            />
                    
            
            <CardContent>
                {!isEditing ?
                    <Typography variant="body2" color="textSecondary" component="p">
                        {post.title} 
                    </Typography>
                :
                    <TextField id = "title" multiline variant = "outlined" type = "text" label = "Contents" name = "title" value = {postToEdit.title} onChange = {handleChange} />
                }
                
            </CardContent>
            <CardActions disableSpacing>
                {/* <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton> */}
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show comments"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent className = "comments-container">

                    {comments.length > 0 && comments.map(comment => (
                        <div key = {comment.id} className = "comment-container">
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {comment.id}
                            </Avatar>
                            <Typography paragraph className = "comment">  
                                {comment.text}
                            </Typography>
                            <Typography paragraph className = "comment-details">
                                {`Commented on ${comment.created_at}`}
                            </Typography>
                            
                        </div>
                        
                    ))}

                    {comments.length === 0 && (
                        <Typography paragraph className = "no-comments-message">
                            Noone has commented yet... Be the first!
                        </Typography>
                    )}
                    <CommentForm postId = {post.id} setComments = {setComments} />
                </CardContent>
            </Collapse>
        </Card>
    );
}
