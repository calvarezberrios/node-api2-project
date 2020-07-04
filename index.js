const express = require("express");

const postsRoute = require("./posts/postsRoute");

const port = 5000;
const server = express();
server.use(express.json());

server.use("/api/posts", postsRoute);

server.use("/", (req, res) => res.status(200).send("API Running successfully!"));



server.listen(port, () => console.log(`Server listening on port ${port}`));