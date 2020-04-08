var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var passport	= require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");
var session = require("express-session");
var methodoverride = require("method-override");

var User	= require("./models/user");

var authroutes = require("./routes/auth.js")
var busroutes = require("./routes/bus.js")

mongoose.set('useUnifiedTopology', true);

// mongoose.connect("mongodb://localhost/auth_app",{ useNewUrlParser: true });
mongoose.connect("mongodb+srv://shivani:art_app@cluster0-fkkly.mongodb.net/test?retryWrites=true&w=majority" , {
					
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		}).then(()=>{
			console.log("Connected to db");
		}).catch(err=>{
			console.log("error:", err.message);
		});


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "Bus",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(authroutes);
app.use(busroutes);


var port = process.env.PORT || 3000;

app.listen(port, function(){
   console.log("The Server Has Started!");
});

