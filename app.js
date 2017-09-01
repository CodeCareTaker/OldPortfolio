var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Project               = require("./models/project"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user");
    //seedDB                = require("./seeds")

//requiring routes
var projectRoutes         = require("./routes/projects"),
    indexRoutes           = require("./routes/index"),
    commentRoutes         = require("./routes/comments")

var url = process.env.DATABASEURL || "mongodb://localhost/hr_portfolio_v1";
mongoose.connect(url);


mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Summer Heat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});