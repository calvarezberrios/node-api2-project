const express = require("express");`1`

const db = require("../../data/db");

const router = express.Router();

router.post("/", (req, res) => {
    if(!(req.body.title || req.body.contents)) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    try {

        db.insert(req.body).then(post => {
            res.status(201).json({id: post.id, ...req.body});
        })
        .catch(() => res.status(500).json({ error: "There was an error while saving the post to the database" }));
    }
    catch {
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    }
});

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;

    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide a text for the comment." });
    }

    db.findById(id)
        .then(post => {
            if(post.length > 0) {
                return post[0];
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .then(post => {
            const newComment = {
                text: req.body.text,
                post_id: post.id
            };

            db.insertComment(newComment)
                .then(comment => {
                    return comment.id;
                })
                .then(commentId => {
                    db.findCommentById(commentId)
                        .then(comment => res.status(200).json(comment))
                        .catch(() => res.status(500).json({ error: "There was an error retrieving the new comment" }));
                })
                .catch(() => res.status(500).json({ error: "There was an error while saving the comment to the database" }));
        })
        .catch(() => res.status(500).json({ error: "There was an error while saving the comment to the database" }));
});

router.get("/", (req, res) => {

    try {
        db.find()
            .then(posts => {
            
            res.status(200).json(posts);
        })
    }
    catch {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    }
});

router.get("/:id", (req, res) => {
    const id = req.params.id;

    try {
        db.findById(id) 
            .then(post => {
                if(post == "") {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
                res.status(200).json(post[0]);
            
            })
    }
    catch {
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if(post.length > 0) {
                return post[0];
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .then(post => {
            db.findPostComments(post.id)
                .then(comments => {
                    res.status(200).json(comments);
                })
                .catch(() => res.status(500).json({ error: "The comments information could not be retrieved." }));
        })
        .catch(() => res.status(500).json({ error: "The comments information could not be retrieved." }));

});

router.put("/:id", (req, res) => {
    const id = req.params.id;

    if(!(req.body.title || req.body.contents)) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    db.findById(id).then(post => {
        if(post.length > 0) {
            db.update(post[0].id, req.body).then(count => {
                if(count > 0) {
                    res.status(200).json({id: post[0].id, ...req.body});
                } 
            })
            .catch(() => res.status(500).json({ error: "The post information could not be modified." }))

        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if(post.length > 0) {
                return post[0];
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .then(post => {
            db.remove(post.id)
                .then(deleted => {
                    res.status(200).json({removedCount: deleted, postRemoved: post});
                })
                .catch(() => res.status(500).json({ error: "The post could not be removed" }))
        })
        .catch(() => res.status(500).json({ error: "The post could not be removed" }))
});

module.exports = router;