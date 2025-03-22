const express = require('express');
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../Models/Listing.js");
const router = express.Router();
const {isLoggedIn,validateListing,isOwner} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});
const listingController = require('../controller/listings.js');

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,    
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing));

// New route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,
            isOwner,
            wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit",
            isLoggedIn,
            isOwner,
            wrapAsync(listingController.renderEditForm))

module.exports = router;