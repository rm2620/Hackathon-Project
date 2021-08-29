//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Food insecurity’s definition varies depending on the source. For example, Feeding America describes food insecurity as a household’s inability to provide adequate nutrition for each family member to live a healthy life. Food insecurity can also describe when people do not know where their next meal will come from. The United States Department of Agriculture (USDA) breaks down the meaning even further. Below, we outline the food insecurity ranges and the USDA’s corresponding definitions.";



const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];
const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/donate", function(req, res){
  res.render("donate", {
    donateContent: contactContent
  });
});

app.get("/blogs", function(req, res){
    Post.find({}, function(err, posts){
      res.render("blog", {
        startingContent: homeStartingContent,
        posts: posts
      });
    });
});

app.post("/blogs", function(req, res){
  res.redirect("/compose");
});


app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post({
  title: req.body.postTitle,
  content: req.body.postBody
});

  post.save(function(err){
      if (!err){
          res.redirect("/blogs");
      }
    });

});


app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
