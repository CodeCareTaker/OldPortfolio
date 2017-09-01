var Project = require("../models/project"),
    Comment = require("../models/comment");

//all the middleware goes into this file
var middlewareObj = {};

//Middleware used to check if the user is logged in.
//Used to prevent users from posting comments while they aren't logged in
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

//Middleware used to check if the user is an adminstrator.
//Used to prevent unauthorized users from editing projects
middlewareObj.isAdmin = function isAdmin(req, res, next){
    if(req.user && req.user.isAdmin == true){
        return next();
    }
    res.redirect("/login");
}

//Checks to see if user has permission to edit selected comment
middlewareObj.checkCommentOwnership = function checkCommentOwnership (req, res, next){
    if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    req.flash("error", "Comment not found");
                    res.render("/blog");
                } else {
                    // did the user post the comment?
                  if(foundComment.author.id.equals(req.user._id)) {
                    next();
                  //if that fails, checks if the user is an admin
                  } else if(req.user && req.user.isAdmin == true){
                    return next();
                  //if both checks fail then user is denied access
                  } else {
                    req.flash("error", "You are not authorized to edit this comment");
                    res.redirect("back");
                  }
                }
            });
    } else {
        req.flash("error", "You must login to edit a comment");
        res.redirect("back");
    }
}

module.exports = middlewareObj;