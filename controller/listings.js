const Listing = require('../Models/Listing');

module.exports.index = async (req,res)=>{
    if(req.query.category)
    {
        let cat = req.query.category;
        const allListings = await Listing.find({category:cat});
        res.render("./listings/index.ejs",{allListings});
    }
    else if(req.query.query)
    {
        let query = req.query.query;
        const results = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Case-insensitive search
                { description: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } }
            ]
        });
        res.json(results);
    }
    else
    {
        const allListings = await Listing.find({});
        res.render("./listings/index.ejs",{allListings});
    }
};

module.exports.createListing = async (req,res,next)=>{
        // we return listing object from views/listings/new.ejs
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New listing created!");
        res.redirect("/listings/");
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    // since we only store review id's in listing populate will fill the details
    const listing  = await Listing.findById(id)
    // here we're doing nested populate i.e., in each review we populate author field
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings/");
    }
    else
    {
        res.render("listings/show.ejs",{listing});
    }

};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings/");
    }
    else
    {
        // console.log(req.user);
        let originalUrl = listing.image.url;
        originalUrl = originalUrl.replace("upload/","upload/w_250/");
        console.log(originalUrl);
        res.render("listings/edit.ejs",{listing, originalUrl});
    }
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    // here we're deconstructing the listing obj to pass it to db for updation for each key-value pair
    console.log(req.body.listing);
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}/`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};