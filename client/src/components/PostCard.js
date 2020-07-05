import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
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

export default function RecipeReviewCard({post}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [comments, setComments] = useState([]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        Axios.get(`http://localhost:5000/api/posts/${post.id}/comments`)
            .then(res => {
                setComments(res.data);
            })
            .catch(err => console.log(err.message, err.response));
    }, []);

    return (
        <Card className={classes.root + " post-card"}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {post.id}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={post.contents}
                subheader={post.created_at}
            />
            
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {post.title}
                </Typography>
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
                </CardContent>
            </Collapse>
        </Card>
    );
}
