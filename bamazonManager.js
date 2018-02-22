//Connect to the npms
var mysql    = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');

//SQL credentials
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

var quantity;
var newQuantity;

connection.connect(function(err) {
  if (err) throw err;
  managersChoice();
});

//prompt the manager what they would like to do
function managersChoice(){
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      'View products for sale',
      'View low inventory',
      'Add to Inventory',
      'Add new product'
    ]
  }).then(function(answer){
    switch (answer.menu) {

      //If the user selects View products for sale
      case 'View products for sale':
        viewProducts();
        break;

      //If the user selects View low inventory
      case 'View low inventory':
        viewLowInventory();
        break;

      //If the user selects Add to Inventory
      case 'Add to Inventory':
        addInventory();
        break;

      //If the user selects Add new product
      case 'Add new product':
        addnewProduct();
        break;
    }
      console.log(answer);
  });
}


//If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts(){
  connection.query('SELECT * FROM products', function(error, results){
    for (var i = 0; i < results.length; i++) {
      var Product = new Products(results[i].item_id,results[i].product_name, results[i].price,results[i].stock_quantity);
      console.table(Product);
    }
    connection.end();
  });
}

//If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function viewLowInventory(){
  connection.query('SELECT * FROM products WHERE stock_quantity <= 5',function(error, results){
    for (var i = 0; i < results.length; i++) {
      console.log('Item ID: ' + results[i].item_id +
      '\nProduct Name: ' + results[i].product_name +
      '\nPrice: ' + results[i].price +
      '\nQuantity: ' + results[i].stock_quantity +
      '\n-----------------------');
    }
    connection.end();
  });
}
//If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.


function addInventory(){
  var databaseQuantity;
  var initialQuantity;
  var questions = [{
    type: 'input',
    name: 'item_id',
    message: 'Which product would you like to add more of? Please enter the item_id.'
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'How many of this item would you like to add?'
  }];

  inquirer.prompt(questions).then(function(answer){

    var itemSelected = answer.item_id;
    var quantityEntered = answer.quantity;
    quantity = parseInt(quantityEntered);

      //Check if the value entered was a number, and if it is, update the database
      if (typeof quantity == 'number' && quantity >= 0) {

        //Query the database in order to find the existing value of the item quantity
        connection.query('SELECT stock_quantity FROM products WHERE item_id = ?',[itemSelected], function(error, results){
          for (var i = 0; i < results.length; i++) {
            databaseQuantity = results[i].stock_quantity;
            initialQuantity = parseInt(databaseQuantity);
            newQuantity = initialQuantity + quantity;
            //Add this item to the database
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[newQuantity,itemSelected], function(error, results){
              if (error) {
                console.log(error);
              } else {
                console.log('Item ' + itemSelected + ' has been increased by a quantity of ' + quantity);
              }
              connection.end();
            });
          }
        });
      } else {
        console.log("Please enter a valid quantity");
      }
    });
}
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

var productName;
var departmentName;
var price;
var stockQuantity;

function addnewProduct(){
  //Create an array of questions to ask
  var questions = [{
    type:"input",
    name: "product_name",
    message: "What is the name of the product you would like to add?"
  },
  {
    type:"input",
    name: "department_name",
    message: "Whic department does this product belong in?"
  },
  {
    type:"input",
    name: "price",
    message: "What is the price of the product?"
  },
  {
    type:"input",
    name: "stock_quantity",
    message: "What should be the initial quantity of this product?"
  }];

  //Ask these questions
  inquirer.prompt(questions).then(function(answer){
    var productName = answer.product_name;
    var departmentName = answer.department_name;
    var price = answer.price;
    var stockQuantity = answer.stock_quantity;

    connection.query('INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',[productName, departmentName, price, stockQuantity], function(error, results){
      if (error) {
        console.log(error);
      } else {
        console.log('Success!');
      }
      connection.end();
    });
  });
}

function Products(itemId, productName, price, quantity){
  this.itemId = itemId,
  this.productName = productName,
  this.price = price,
  this.quantity = quantity;
};
