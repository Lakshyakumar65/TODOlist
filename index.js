const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

var app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect to MongoDB with error handling
mongoose.connect("mongodb://localhost:27017/todo")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const trySchema = new mongoose.Schema({
    name: String
});

const item = mongoose.model("task", trySchema);

// Initialize database only once if empty
app.get("/setup", async function(req, res) {
    try {
        const count = await item.countDocuments();
        if (count === 0) {
            const initialItems = [
                { name: "Learn DSA" },
                { name: "Learn MERN" },
                { name: "Learn UI/UX" },
                { name: "Learn Hacking" },
                { name: "Learn App Dev" }
            ];
            
            await item.insertMany(initialItems);
            console.log("Initial items added");
        }
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error setting up database");
    }
});

// Main route using async/await instead of callbacks
app.get("/", async function(req, res) {
    try {
        const foundItems = await item.find({});
        res.render("list", {ejes: foundItems});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tasks");
    }
});

// Add new task with validation
app.post("/", async function(req, res) {
    const itemName = req.body.ele1.trim();
    
    if (!itemName) {
        return res.redirect("/");
    }
    
    try {
        const newTask = new item({
            name: itemName
        });
        
        await newTask.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding task");
    }
});

// Delete task with better error handling
app.post("/delete", async function(req, res) {
    const checked = req.body.checkbox1;
    
    try {
        await item.findByIdAndRemove(checked);
        console.log("Task deleted");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting task");
    }
});

app.listen(8000, function() {
    console.log("Server started on port 8000");
});