const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

// MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
// .then(()=>{
//     console.log("Db is running");
// })
// .catch(err=>{
//     console.log(err);
// })
// async function main()
// {
//     await mongoose.connect(MONGO_URL);
// }

let listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        // required:true
    },
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        // required:true
    },
    location:{
        type:String,
        // required:true
    },
    country:{
        type:String,
        // required:true
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
    },
    category:{
        type:String,
        enum:["Farms","Favourite","Luxury","Surfing","Castle","Rooms","Pools","Trekking"]
    }
});

// This middleware is called when we delete a listing
// If you call 'findByIdAndDelete' this middleware will be called which deletes all reviews associated with a listing
listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing)
    {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

let Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;