const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const todoModel = require('./models/todo');

const app = express();

app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

app.get('/todo', async(req,res)=>{
    try{
        const todos = await todoModel.find();
        res.status(200).json(todos);
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
});

app.post('/todo',upload.single('pic'), async(req,res)=>{
    const newTodo = new todoModel({
        // id: Date.now(),
        name: req.body.todoInput,
        completed: false,
        fileName: req.file.filename
    });

    try{
        await newTodo.save();
        res.redirect('/');
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
});


app.put('/todo/:id',async(req,res)=>{
    const id = req.params.id;
    const newTodo ={
        _id: id,
        name: req.body.name,
        completed : req.body.completed,
        fileName: req.body.fileName
    };
    try {
        await todoModel.findByIdAndUpdate(id, newTodo, {new : true});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

});

app.delete('/todo/:id',async(req,res)=>{
    const id = req.params.id;
    try {
        await todoModel.findByIdAndRemove(id);
        return res.sendStatus(202);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
});

mongoose.connect("mongodb+srv://admin:admin123*@cluster0.kiqq9ku.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    app.listen(4002,()=>{
        console.log("Server started on port no. 4002...");
    });
})
.catch((error)=>{
    console.log(error);
})

