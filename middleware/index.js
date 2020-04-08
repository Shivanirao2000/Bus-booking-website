var middlewareobj = {};


middlewareobj.checkOwnership =  function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.user._id, function(err, foundcampground){
        if(err)
            res.redirect("back");
        else{
            if(req.user._id.equals('5e8d95543246be0458415e14')){
                next();
            }
            else{
                res.redirect("back");
            }
        }
    });
    }
    else{
        req.flash("error", "You need to login first");
        res.redirect("back");
    }	
}

middlewareobj.isLoggedIn =  function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}

module.exports= middlewareobj;