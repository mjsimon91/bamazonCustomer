var mysql = require('mysql');
var inquirer = require('inquirer');

// SQL credentials
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

connection.connect(function(err) {
  if (err) throw err;
  supervisorsChoice();
});
// list a set of menu options:
//    * View Product Sales by Department
//    * Create New Department

function supervisorsChoice(){
  inquirer.prompt({
    type:"list",
    name:"menu",
    message:"What Would you like to do?",
    choices:[
      "View Product Sales by Department",
      "Create New Department"
    ]
  }).then(function(answer){
    switch (answer.menu) {
      case "View Product Sales by Department":
        viewSalesByDepartment();
        break;

      case "Create New Department":
        createDepartment();
        break;
    }
  })
}

 // When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window.

 function viewSalesByDepartment(){
   var totalProductSales = 0;
   inquirer.prompt({
     type:"input",
     name:"whichDepartment",
     message:"Which department would you like to view?"
   }).then(function(answer){
     connection.query('SELECT * from products WHERE department_name = ?', [answer.whichDepartment], function(error, response){
       if (error) {
         console.log(error);
       } else {
         //loop through all of the responses and add them to the totalProductSales
         for (var i = 0; i < response.length; i++) {
           totalProductSales += response[i].product_sales
         }
         console.log(totalProductSales);
         console.log('------------');
         console.log(' ');
       }
     })
     //Get all the data from the departments table
     connection.query('SELECT * FROM departments',function(error, response){
       if (error) {
         console.log(error);
       } else {
         //loop through each response in order to get the departments
         for (var i = 0; i < response.length; i++) {
           totalProfit = totalProductSales - response[i].over_head_costs
           console.log(
             'Department ID: ' + response[i].department_id +
             '\nDepartment Name: ' + response[i].department_name +
             '\nOverhead Costs: ' + response[i].over_head_costs +
             '\nProduct Sales: ' + totalProductSales +
             '\nTotal Profit: ' + totalProfit
         );
         }
       }
       connection.end();
     })
   })
 }

 function createDepartment(){
   inquirer.prompt({
     type:'input',
     name: 'addDepartment',
     message:'What department would you like to add?'
   }).then(function(answer){
     connection.query('INSERT INTO departments(department_name) VALUES (?)',[answer.addDepartment], function(error, result){
       if (error) {
         console.log(error);
       } else {
         console.log(`${answer.addDepartment} was successfully added`);
       }
       connection.end();
     })
   })
 }
