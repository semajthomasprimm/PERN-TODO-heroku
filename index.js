// RESTFUL API with PostgresSQL

// requires express library
const express = require('express');
// takes express library and runs it
const app = express();
const cors = require('cors');
const pool = require('./db');
const path = require('path');
const PORT = process.env.PORT || 5000;

// proccess.env.PORT

//middleware
app.use(cors());
// gives us access to request body
app.use(express.json()); // req.body

//app.use(express.static(path.join(__dirname, "client/build")));

if(process.env.NODE_ENV === "production"){
    // server static content
    app.use(express.static(path.join(__dirname, "client/build")));
}

//ROUTES//

// Create a todo
app.post("/todos", async(req, res) => {
    // await; waits for function to complete before continuing
    try{
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *;",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch(err){
        console.error(err.message);
    }
});

// Get all todos
app.get("/todos", async(req, res) =>{
    try{
        const allTodos = await pool.query("SELECT * FROM todo;");
        res.json(allTodos.rows);
    } catch(err){
        console.error(err.message);
    }
});

// Get a todo
app.get("/todos/:id", async(req, res) =>{
    try{
        const { id } = req.params;
        const todo = await pool.query(
            "SELECT * FROM todo WHERE todo_id = $1;", 
            [id]
        );
        res.json(todo.rows[0]);
    } catch(err){
        console.error(err.message);
    }
});


// Update a todo
app.put("/todos/:id", async(req, res) =>{
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2;", 
            [description, id]
        );
        res.json("Todo was updated!");
    } catch (error) {
        console.error(err.message);
    }
});


// Delete a todo
app.delete("/todos/:id", async(req, res) =>{
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1;",
            [id]
        );
        res.json("Todo was deleted");
    } catch (error) {
        console.log(err.message);
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// need to listen to port # to start server
app.listen(PORT, () =>{
    // callback function to show how server has started
    console.log(`Server has started on port ${PORT}`);
});