const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    completed : {
        type : Boolean,
        required : true
    },
    fileName : {
        type : String,
        required : true
    },
}, {timestamps : true});

module.exports = mongoose.model("Todo", TodoSchema);