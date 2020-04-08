var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var User		= require("./models/user");
var passport	= require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");

mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/auth_app",{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser('secretString'));
app.use(require("express-session")({
	secret: "Bus app",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var bus = [{name:"99B",start_route:["Majestic","Ananda Roa Circle","Central"],end_route:["Malleshwaram","Yeshwanthpura","Mathikere"]},{name:"227C",start_route:["K.R Market","Azad Nagar","Mysore Road"],end_route:["Nayandahalli","R.V.C.E","Kengeri"]},{name:"331A",start_route:["Shivajinagar","Trinity Circle","Marathahalli"],end_route:["C.M.R.I.T","Whitefield","Kadugodi"]},{name:"304H",start_route:["Majestic","K.R.Circle","Halasuru"],end_route:["K.R Puram","Brigade Tech Park","Arehalli"]}]

var rest=[{bus_name1:""}]
var selected={}
var bus_name1=""
var ticket_array=[]

var today = new Date();
var day= today.getDate();
var month = today.getMonth()+1; 
var year = today.getFullYear();

app.get("/a1",isLoggedIn,function(req,res){
	res.render("busdetails.ejs",{bus:bus,rest:rest})
})

app.post("/a1",function(req,res){
 bus_name1=req.body.bus_name;
 selected ={bus_name1:bus_name1}
rest[0]=selected;
	res.redirect("/a1")
})
	
app.post("/b1",function(req,res){
	var start_route1=req.body.start_route;
	var end_route1=req.body.end_route;
	var no_of_ppl1=req.body.no_of_ppl;
	 selected ={bus_name1:bus_name1,start_route1:start_route1,end_route1:end_route1,no_of_ppl1:no_of_ppl1}
	rest[0]=selected
	res.redirect("/b1")
})
var sum=0,a,n=1234567,x,n1,num,i=0;

function get_number(){
	sum=0;
	if(day<10){
		sum=day;
	}else{
		a=day%10;
		b=Math.floor(day/10);
		sum=b+a;
	}
	x=sum*month*year;
	n1=n%10;
	n=n/10;
	n=Math.floor(n1*1000000+n);
	num=n+x;
	num=num%1000000;
    return num;
}

app.get("/b1",isLoggedIn,function(req,res){
	rest[0].bus_name="xxx"
	var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
	var nd = new Date(utc + (3600000*+5.5));
	var time =  nd.toLocaleString();
	var ticket_number = get_number()+i;
	ticket_array.push(ticket_number);
	i=i+1;
	res.render("ticket_display.ejs",{rest:rest,ticket_number:ticket_number,time:time})
})

app.get("/c1",isLoggedIn,function(req,res){
	res.render("conductor_check.ejs",{ticket_array:ticket_array})
})

app.get("/", function(req, res){
	res.render("home.ejs");
})

app.get("/login", function(req,res){
	res.render("login.ejs",{message:req.flash("error")});
});

app.post("/login", passport.authenticate("local",{
<<<<<<< HEAD
	successRedirect: "/secret",
	failureRedirect: "/login.ejs"
=======
	/*successRedirect: "/secret",
	failureRedirect: "/login.ejs"*/

	successRedirect: "/a1",
	failureRedirect: "/login"
>>>>>>> b0630a0127dc0cf4afcdc361273fd5a1fccbacc2
}), function(req,res){
});


app.get("/register", function(req,res){
	res.render("register.ejs");
});

app.post("/register", function(req,res){
	console.log(req.body.number);
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		
		
		if(err){
			req.flash("error", err.message)
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome "+ user.username);
			res.redirect("/a1");
		});
	});
});

app.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged out");
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first")
	res.redirect("/login");
}

app.get("/fetchDetails", function(req,res){
	res.render("fetchDetails.ejs", {bus:bus,rest:rest});
});

app.post("/fetchDetails", function(req,res){
	var bus_name1=req.body.bus_name;
	var start_route1=req.body.start_route;
	var end_route1=req.body.end_route;
	var no_of_ppl1=req.body.no_of_ppl;
	selected ={bus_name1:bus_name1,start_route1:start_route1,end_route1:end_route1,no_of_ppl1:no_of_ppl1}
	rest[0]=selected
	res.redirect("/fethDetails.ejs"); 
});

app.get("/payment", function(req,res){
	res.render("payment.ejs");
})

function get_amount(){
	var no_of_ppl1=rest[0].no_of_ppl;
	var amount=Math.floor((Math.random()*15)+5)*no_of_ppl;
	return amount;
}

app.post("/payment", function(req,res){
	var amount = get_amount();
	res.redirect("/payment");
});

app.get("/credit", function(req,res){
	res.render("credit.ejs");
})
app.post("/credit", function(req,res){
	res.redirect("/credit");
});

app.get("/otp",function(req,res){
	res.render("otp.ejs");
})
app.post("/otp",function(req,res){
	res.redirect("/otp");
});
app.get("/googlepay",function(req,res){
	res.render("googlepay.ejs");
})
app.post("/googlepay",function(req,res){
	res.redirect("/googlepay");
});
app.get("/success",function(req,res){
	res.render("success.ejs");
})
app.post("/success",function(req,res){
	res.redirect("/success");
});

app.listen(port=3000, function(){
   console.log("The Server Has Started!");
});
