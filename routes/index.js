var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});


// ===================
// AUTH ROUTES
// ===================

//Show registration form
router.get("/register", function(req, res){
    res.render("register");
});


//Handling user sign up
router.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    var newUser = new User ({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the site, feel free to check out and comment on my projects " + user.username);
            res.redirect("/projects");
        });
    });
});

//Login Routes

//render login form
router.get("/login", passport.authenticate("local",
    {
        successRedirect: "/projects",
        failureRedirect: "login",
    }), function(req, res) {
        
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/projects");
});

module.exports = router;