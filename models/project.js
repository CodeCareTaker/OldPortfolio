var mongoose = require("mongoose");

//SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    title: String,
    image: String,
    image2: String,
    image3: String,
    link: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Project", projectSchema);