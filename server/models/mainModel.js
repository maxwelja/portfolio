const mongoose = require('mongoose');

const MainSchema = new mongoose.Schema ({
    title: {type: String, default: "Untitled"},
    content: {type: [String], default: []},
}, {timestamps: true}, {collection: "Main"});

const Main = mongoose.model("Main", MainSchema);
module.exports = Main;