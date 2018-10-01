const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({

    title: String,

    body: String

});

const note = mongoose.model("note", noteSchema);

module.exports = note;