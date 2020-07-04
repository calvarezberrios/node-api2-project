const express = require("express");

const db = require("../data/db");

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
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    });
});

module.exports = router;