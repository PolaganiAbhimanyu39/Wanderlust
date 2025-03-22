const express = require('express');
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressErrors.js")
const Listing = require("../Models/Listing.js");
const router = express.Router({mergeParams:true});
const Review = require("../Models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middleware.js');

const reviewController = require('../controller/reviews.js');

// Post route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview))

// Delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview))

module.exports = router;