var express    = require("express");
var router     = express.Router();
var Project    = require("../models/project");
var middleware = require("../middleware");

// ===================
// PROJECT ROUTES
// ===================


//INDEX - show all projects in ascending(oldest) order. Default option
router.get("/", function(req, res){
    //Get all projects from DB
    Project.find().sort({created: 1}).exec(function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/index",{projects: allProjects}); 
        }
    });
});

//INDEX - show all projects in ascending(latest) order
router.get("Desc/", function(req, res){
    //Get all projects from DB
    Project.find().sort({created: -1}).exec(function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/index",{projects: allProjects}); 
        }
    });
});

//INDEX - show all projects in ascending(oldest) order
router.get("Alpha/", function(req, res){
    //Get all projects from DB
    Project.find().sort({title: 1}).exec(function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/index",{projects: allProjects}); 
        }
    });
});

//INDEX - show all projects in ascending(oldest) order
router.get("Alpha/", function(req, res){
    //Get all projects from DB
    Project.find().sort({title: 1}).exec(function(err, allProjects){
        if(err){
            console.log(err);
        } else {
            res.render("projects/index",{projects: allProjects}); 
        }
    });
});

//CREATE - Add new project to database
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to projects array
    var title = req.body.title;
    var image = req.body.image;
    var image2 = req.body.image2;
    var image3 = req.body.image3;
    var desc = req.body.description;
    var newProject = {title: title, image: image, image2: image2, image3: image3, description: desc};
    // Create a new project and save to DB
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to projects page
            res.redirect("/projects");
        }
    });
});

//NEW - show form to create new project
router.get("/new", middleware.isAdmin, function(req, res){
   res.render("projects/new"); 
});

//SHOW - Show info about one project
router.get("/:id", function(req, res) {
    //find the project with provided ID
    Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
        } else {
            console.log(foundProject);
            //render show template with that project
            res.render("projects/show", {project: foundProject});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.isAdmin, function(req, res){
    Project.findById(req.params.id, function(err, editProject) {
        if(err){
            res.redirect("back");
        } else {
            res.render("projects/edit", {project: editProject});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.isAdmin, function(req, res){
    //update project information
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updateProject){
        if(err) {
            res.redirect("/projects");
        } else {
            res.redirect("/projects/" + req.params.id);
        }
    });
});

//Delete Route
router.delete("/:id", middleware.isAdmin, function(req, res) {
    //remove project from the website
    Project.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/projects");
        } else {
            res.redirect("/projects");
        }
    });
});

module.exports = router;