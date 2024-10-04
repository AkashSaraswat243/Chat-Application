require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat.js');
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    })

const db = process.env.DB_URL;

async function main() {
    await mongoose.connect(db);
}

// HOME ROUTE
app.get('/', (req, res) => {
    res.send("Home page");
});

// INDEX ROUTE
app.get('/chats', async (req, res) => {
    let chats = await Chat.find();
    res.render("index", { chats });
});

//CREATE CHAT ROUTE (GET DATA)
app.get('/chats/new', (req, res) => {
    res.render("new")
})

//CREATE CHAT ROUTE (POST DATA)
app.post('/chats', (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    newChat
        .save()
        .then((res) => {
            console.log("chat was saved");
        })
        .catch((err) => {
            console.log(err);
        })
    res.redirect("/chats");
});

//Edit ROUTE
app.get('/chats/:id/edit', async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit", { chat });
})

//PUT ROUTE (UPDATE)
app.put('/chats/:id', async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    res.redirect("/chats");
});

//DELETE ROUTE
app.delete('/chats/:id', async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

app.get('/', (req, res) => {
    res.send("root is working");
});

app.listen(3000, () => {
    console.log("Server is listen on port 3000");
});