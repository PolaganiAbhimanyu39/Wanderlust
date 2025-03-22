const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/Listing.js");

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Db is running");
})
.catch(err=>{
    console.log(err);
})
async function main()
{
    await mongoose.connect(MONGO_URL);
}

async function initDb()
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'679c6310125a4dbd11001770'}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDb();