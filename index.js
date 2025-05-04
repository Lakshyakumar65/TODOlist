const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");


var app = express();

app.set("view engine","ejs");



app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// var items = [];
mongoose.connect("mongodb://localhost:27017/todo");
const trySchema = new mongoose.Schema({
    name:String
});
const item = mongoose.model("task",trySchema);
const todo = new item({
    name:"Learn DSA "
});
const todo2 = new item({
    name:"Learn MERN  "
});
const todo3 = new item({
    name:"Leran UI/UX"
});
const todo4 = new item({
    name:"Learn Hacking  "
});
const todo5 = new item({
    name:"Learn App Dev "
});
todo.save();
// todo1.save();
// todo2.save();
// todo3.save();
// todo4.save();
// todo5.save();

// var example ="Working";
app.get("/", function(req,res){
   item.find({},function(err,foundItems){
    if(err){
        console.log(err);
    }
    else{
        res.render("list",{ejes : foundItems});
    }
});
});


app.post("/",function(req,res){
    const itemName = req.body.ele1;
    const todo4 = new item({
       name:itemName
    });
    todo4.save();
    res.redirect("/");
});

app.post("/delete",function(req,res){
    const checked = req.body.checkbox1;
    item.findByIdAndRemove(checked,function(err){
        if(!err){
           console.log("deleted");
           res.redirect("/");
        }
       });
});
app.listen(8000,function(){
    console.log("Server started");
    
});
