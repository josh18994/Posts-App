// TODO - Add web sockets for real time app refresh

const express = require("express");

const Authentication = require('../middleware/authentication');
const PostsController = require('../controller/posts');

const router = express.Router();

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

router.post("", Authentication, PostsController.savePost);

router.put("/:id", Authentication, PostsController.editPost);

// TODO need to add delete , patch calls

module.exports = router;
