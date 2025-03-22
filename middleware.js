const ExpressError = require("./utils/ExpressErrors.js")
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Listing = require('./Models/Listing.js');
const Review = require('./Models/review.js');

module.exports.isLoggedIn = (req,res,next)=>{
    // req.isAuthenticated() - this is a passport method which returns true if a user is logged in
    if(!req.isAuthenticated())
    {
        req.session.redirectedUrl = req.originalUrl;
        req.flash("error","You must login to do this");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectedUrl = (req,res,next)=>{
    if(req.session.redirectedUrl)
    {
        res.locals.redirectedUrl = req.session.redirectedUrl;
    }
    next();
};


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You don't have permission to make these changes");
        return res.redirect(`/listings/${id}/`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}/`);
    }
    next();
}