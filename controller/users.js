const User = require('../Models/user.js');

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try
    {
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        // login - this is a passport method which takes a user(to login) and callback
        req.login(registeredUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success","Welcome to wanderlust!");
            res.redirect('/listings/');  
        })
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = (req,res)=>{
    req.flash("success","Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectedUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    // logOut - this is a passport method which logs the user out.
    // It takes a callback as input
    // err - this parameter will be passed when an error occurs during the process of logout
    req.logOut((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","You have logged out successfully");
        res.redirect("/listings");
    });
};