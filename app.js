var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    Project               = require("./models/project"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    //seedDB                = require("./seeds")

var url = process.env.DATABASEURL || "mongodb://localhost/hr_portfolio_v1";
mongoose.connect(url);

var app = express();
mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Summer Heat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all projects in ascending(oldest) order. Default option
app.get("/projects", function(req, res){
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
app.get("/projectsDesc", function(req, res){
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
app.get("/projectsAlpha", function(req, res){
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
app.get("/projectsAlpha", function(req, res){
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
app.post("/projects", isLoggedIn, function(req, res){
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
app.get("/projects/new", isAdmin, function(req, res){
   res.render("projects/new"); 
});

//SHOW - Show info about one project
app.get("/projects/:id", function(req, res) {
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
app.get("/projects/:id/edit", isAdmin, function(req, res){
    Project.findById(req.params.id, function(err, editProject) {
        if(err){
            res.render("/projects");
        } else {
            res.render("projects/edit", {project: editProject});
        }
    });
});

//UPDATE ROUTE
app.put("/projects/:id", isAdmin, function(req, res){
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
app.delete("/projects/:id", isAdmin, function(req, res) {
    //remove project from the website
    Project.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/projects");
        } else {
            res.redirect("/projects");
        }
    });
});

// //Auth Routes

//show sign-up form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    //object captures info user entered to create account
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", "Account creation unsuccessful, " + err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Account successfully created, Welcome " + user.username);
            res.redirect("/");
        });
    });
});

// ===================
// COMMENT ROUTES
// ===================

//Lets user type a new comment
app.get("/projects/:id/comments/new", isLoggedIn, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {project: project});
        }
    });
});

//Posts created comment
app.post("/projects/:id/comments", isLoggedIn, function(req, res){
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
app.get("/projects/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {project_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update
app.put("/projects/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        } else {
            req.flash("success", "Comment has been edited");
            res.redirect("/projects/" + req.params.id);
        }
    })
})

//Comment Destroy Route
app.delete("/projects/:id/comments/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("error", "Comment has been deleted!");
            res.redirect("/projects/" + req.params.id);
        }
    });
});

//Login Routes
//render login form
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
}), function(req, res) {
     
});

//Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

function isAdmin(req, res, next){
    if(req.user && req.user.isAdmin == true){
        return next();
    }
    res.redirect("/login");
}

//Checks to see if user has permission to edit selected comment
function checkCommentOwnership (req, res, next){
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});




