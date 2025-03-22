if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');


const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const app = express();

app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);

const port = "3000";

const dbUrl = process.env.ATLAS_URL;
main()
.then(()=>{
    console.log("Db is running");
})
.catch(err=>{
    console.log(err);
});
async function main()
{
    await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.send("Home page");
// })

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
// Always place flash above routes
app.use(flash())
// Always use passport after defining session as above
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// routes
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// What this does is "*" -> means to all routes,We come here when none of the above routes are matched
//  ".all" means all methods like(get,put,delete,patch,etc)

app.get("/",(req,res)=>{
    res.redirect("/listings");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log("Listening at port: ",port);
})