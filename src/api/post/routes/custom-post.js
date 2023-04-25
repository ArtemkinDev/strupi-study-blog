module.exports = {
    routes: [
        {
            method: "GET",
            path: "/posts/custom-posts",
            handler:"api::post.post.getCustomPosts"
        }
    ]
}
