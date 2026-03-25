import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/bookstore")
    .then(() => {
        console.log("MongoDB test connection successful");
        process.exit();
    })
    .catch(err => console.error(err));