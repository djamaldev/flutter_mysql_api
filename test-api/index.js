var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

// default route
app.get('/', function (req, res) {
return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'book'
});

// connect to database
dbConn.connect(); 

// Retrieve all users 
app.get('/get_book_api', function (req, res) {
dbConn.query('SELECT * FROM book', function (error, results, fields) {
if (error) throw error;
return res.send({data: results});
});
});

// Add a new user  
app.post('/add_book_api', function (req, res) {
    const values = [req.body.title, req.body.author];
if (!req.body) return 'error data';
dbConn.query("INSERT INTO book (title, author) VALUES(?)", [values] ,function (error, results, fields) {
if (error) throw error;
return res.send({data: results, message: 'New book has been created successfully.' });
});
});

//  Update user with id
app.put('/book', function (req, res) {
let book_id = req.body.book_id;
let book = req.body.book;
if (!book_id || !book) {
return res.status(400).send({ error: book, message: 'Please provide book and book_id' });
}
dbConn.query("UPDATE book SET book = ? WHERE id = ?", [book, book_id], function (error, results, fields) {
if (error) throw error;
return res.send({ error: false, data: results, message: 'book has been updated successfully.' });
});
});
//  Delete user
app.delete('/delete_book_api/:id', function (req, res) {
if (![req.params.id]) {
return res.status(400).send({ error: true, message: 'Please provide book id' });
}
dbConn.query("DELETE FROM book WHERE id = ?", [req.params.id], function (error, results, fields) {
if (error) throw error;
//console.log(id);
return res.send({data: results, message: 'book has been deleted successfully.' });
});
}); 

// set port
app.listen(3000, function () {
console.log('Node app is running on port 3000');
});
module.exports = app;