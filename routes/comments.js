var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Project    = require("../models/project"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

// ===================
// COMMENT ROUTES
// ===================

//Lets user type a new comment
router.get("/projects/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {project: project});
        }
    });
});

//Posts created comment
router.post("/projects/:id/comments", middleware.isLoggedIn, function(req, res){
    //lookup project using ID
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
            req.flash("error","Error: " + err.message);
            res.redirect("/projects");
        } else {
         Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", err.message);
             } else {
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                 project.comments.push(comment);
                 project.save();
                 console.log(comment);
                 req.flash("success", "Your comment has been posted");
                 res.redirect("/projects/" + req.params.id);
             }
         })
            console.log(req.body.comment);
        }
    })
});

//Comment Edit
router.get("/projects/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {project_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update
router.put("/projects/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        } else {
            req.flash("success", "Comment has been edited");
            res.redirect("/projects/" + req.params.id);
        }
    });
});

//Comment Delete
router.delete("/projects/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("error", "Comment has been deleted!");
            res.redirect("/projects/" + req.params.id);
        }
    });
});

module.exports = router;