var mongoose = require("mongoose")
var Project = require("./models/project")
var Comment    = require("./models/comment")

var data = [

];
    
   
function seedDB(){
    //Remove all projects
    // Project.remove({}, function(err){
    //     if(err){
    //         console.log(err)
    //     }
    //     console.log("removed projects!");
    //     //Add a few projects
        data.forEach(function(seed){
            Project.create(seed, function(err, project) {
                if(err){
                    console.log(err);
                } else {
                console.log("added a project");
                //Create a comment
                // Comment.create(
                //     {
                //         text: "Why isn't it moving?",
                //         author: "Homer"
                //     }, function(err, comment){
                //         if(err){
                //             console.log(err);
                //         } else {
                //             project.comments.push(comment);
                //             project.save();
                //             console.log("Created new comment")
                //         }
                //     });
                    
                 }
            //});
        });
    });
}

module.exports = seedDB;


