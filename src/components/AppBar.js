import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Axios from 'axios';

const initialValues = {
    title: "",
    contents: ""
};

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #ccc',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        display: "flex",
        flexDirection: "column",

    },
}));

export default function SearchAppBar({posts, setPosts}) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [newPost, setNewPost] = useState(initialValues);

    const handleChange = e => {
        setNewPost({
            ...newPost,
            [e.target.name]: e.target.value
        });
    }

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const createPost = e => {
        //e.preventDefault();

        if(newPost.title && newPost.contents ) {
            Axios.post("/api/posts", newPost)
                .then(res => {
                    console.log(res.data);
                    setPosts(posts.map(post => {
                        if(post.id === res.data.id) {
                            return {
                                ...post,
                                title: res.data.title,
                                contents: res.data.contents
                            };
                        }
                        return post;
                    }))
                    handleClose();
                })
                .catch(err => console.log(err.message, err.response.data));
        }
    }

    const body = (
        <form style = {modalStyle} className = {classes.paper} onSubmit = {createPost} autoComplete = "off">
            <h3>Create a Post...</h3>
            <TextField 
                id = "contents"
                type = "text"
                name = "contents"
                variant = "outlined"
                label = "Title"
                value = {newPost.contents}
                onChange = {handleChange}
            />
            <br />
            <TextField 
                id = "title"
                type = "text"
                name = "title"
                variant = "outlined"
                label = "Contents"
                value = {newPost.title}
                onChange = {handleChange}
                multiline
                rows = {4}
            />
            <br />
            <div style = {{textAlign: "center"}}>
                <Button variant = "contained" type = "submit">Submit</Button>{" "}
                <Button variant = "contained" onClick = {() => {setNewPost(initialValues); handleClose()}}>Cancel</Button>
            </div>
        </form>
    );

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        My Posts API
                    </Typography>
                    <IconButton
                        edge="end"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Create Post"
                        onClick = {handleOpen}
                    >
                        <AddIcon />
                    </IconButton>
                    
                </Toolbar>
            </AppBar>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
