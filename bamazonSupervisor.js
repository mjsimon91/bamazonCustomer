var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');


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
     connection.query('SELECT SUM(p.product_sales) as total_product_sales, d.department_id, d.department_name, d.over_head_costs, d.over_head_costs FROM products as p INNER JOIN departments as d ON d.department_name = p.department_name WHERE d.department_id = ? GROUP BY d.department_id', [answer.whichDepartment], function(error, response){
       if (error) {
         console.log(error);
         connection.end();
       } else {
         //loop through all of the responses and add them to the totalProductSales
         console.log('');
         console.table([{
           'Department ID': response[0].department_id,
           'Department Name': response[0].department_name,
           'Over Head Costs': response[0].over_head_costs,
           'Product Sales': response[0].total_product_sales,
           'Total Profit': response[0].total_product_sales - response[0].over_head_costs
        }]);
         connection.end();
       }
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
