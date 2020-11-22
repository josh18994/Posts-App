const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
    const pgNumber = req.query.page ? +req.query.page : 1;
    const pgSize = req.query.pageSize ? +req.query.pageSize : 10;
    const totalCount = 0; // TODO - Need to figure a way to return total count of objects
    Post.find()
        .skip((pgNumber - 1) * pgSize)
        .limit(pgSize)
        .then((result) => {
            res.status(200).json({
                message: "Posts fetched successful",
                posts: TransformData(result),
            });
        });
};

exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then((result) => {
        if(!result) return res.status(404).json({ 
            message: 'Post not found', 
            posts: result
        });
        res.status(201).json({
            message: "Post fetched successfully",
            post: TransformData([].concat(result)),
        });
    });
};

exports.savePost = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.verifiedUser.id
    });
    post.save().then((result) => {
        res.status(201).json({
            message: "Post saved successfully",
            post: TransformData([].concat(result)),
        });
    });
};

exports.editPost = (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        creator: req.verifiedUser.id
    });

    Post.findById(req.params.id).then((result) => {
        if(!result) return res.status(404).json({ 
            message: 'Post not found', 
            posts: result
        });
        Post.updateOne({ _id: req.params.id, creator: req.verifiedUser.id }, post).then((response) => {
            if(response.n > 0) {
                res.status(200).json({ 
                    message: "Update Successful", 
                    post: TransformData([].concat(post))
                });
            } else {
                res.status(403).json({ message: "Unauthorized user, cannot update this post" });
            }
        });
    });
}

const TransformData = (data) => {
    return data.map(x => {
        return {
            id: x._id,
            title: x.title,
            content: x.content,
            creator: x.creator
        }
    });
} 