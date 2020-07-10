const express = require("express");
const cors = require("cors");

const postsRoute = require("./posts/postsRoute");

const port = 5000;
const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/posts", postsRoute);

server.get("/", (req, res) => res.status(200).send("API Running successfully!"));



server.listen(port, () => console.log(`Server listening on port ${port}`));