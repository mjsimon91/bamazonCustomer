//Connect to the mysql npm
var mysql  = require('mysql');
var inquirer = require('inquirer');

//SQL credentials
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

//Connect to the database 
connection.connect(function(error){
  if (error) throw error
})
