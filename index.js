import express from "express";
import path from "path";

import { fileURLToPath } from "url";
import bodyParser from "body-parser"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
let userBlogs = [];
let nextId = 1;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req, res) => {
    let entryMessage;
    if(userBlogs.length !== 0){
        entryMessage = "Your blogs!";
    }
    else{
        entryMessage = "Create your first blog here!";
    }
    res.render(__dirname + "/blog-page.ejs", {
        message: entryMessage,
        blogUser: userBlogs,
    });
});

app.get("/blog-route", (req, res) => {
    res.render(__dirname + "/blog.ejs");
});

app.post("/submit", (req, res) => {
    const formInfo = {id: String(nextId++), ...req.body};
    userBlogs.push(formInfo);
    res.redirect("/");
});

app.get("/edit-blog/:id", (req, res) => {
    const { id } = req.params;
    const post = userBlogs.find(p => p.id === id);
    res.render(__dirname + "/update.ejs", { post });
});

app.post("/update/:id", (req, res) => {
    const blogId = userBlogs.findIndex(p => p.id === req.params.id);
    const {id, blogTitle, blogPublisher, blogContent, datePublished} = req.body;
    userBlogs[blogId] = {id: req.params.id, blogTitle, blogPublisher, blogContent, datePublished};
    res.redirect("/");
});

app.post("/delete-blog/:id", (req, res) => {
    const { id } = req.params;
    const initLength = userBlogs.length;
    userBlogs = userBlogs.filter(p => p.id !== id);

    if(userBlogs.length === initLength){
        return res.status(404).send("Post not found");
    }
    res.redirect("/");
});

app.get("/show-post/:id", (req, res) => {
    const { id } = req.params;
    const post = userBlogs.find(p => p.id === id);
    res.render(__dirname + "/view.ejs", {post});
});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});