var express = require("express");
var app = express();
app.set("view engine","ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport=require("passport"),
LocalStrategy=require("passport-local"),
Comment=require("./models/comment");
var User=require("./models/user");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var flash=require("connect-flash");

methodOverride = require("method-override");

//requiring routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");



Campground=require("./models/campground");
seedDB=require("./seeds")
seedDB();

var commentRoutes = require("./routes/comments")

var url=process.env.DATABASEURL || "mongodb://localhost/yelpcamp"
mongoose.connect(url);


app.use(require("express-session")({
    secret: "Its a secret",
    resave: false,
    saveUninitialized: false
}))
app.use('/public', express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));
app.use(flash());


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req,res,next)
{
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
}) 


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


 
app.listen(process.env.PORT, process.env.IP,function()  //replace process.env.PORT, process.env.IP with 5000 if running in local
{
    console.log("Serving AngelCamp");
})
