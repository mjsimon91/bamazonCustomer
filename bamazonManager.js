//Connect to the npms
var mysql    = require('mysql');
var inquirer = require('inquirer');

//SQL credentials
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bamazon_db'
});

var quantity;
var initialQuantity;
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
        //Add new product function
        break;
    }
      console.log(answer);
  });
}


//If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewProducts(){
  connection.query('SELECT * FROM products', function(error, results){
    for (var i = 0; i < results.length; i++) {
      console.log('Item ID: ' + results[i].item_id +
      '\nProduct Name: ' + results[i].product_name +
      '\nPrice: ' + results[i].price +
      '\nQuantity: ' + results[i].stock_quantity +
      '\n-----------------------');
    }
  })
  endConnection();
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
  })
  endConnection();
}
//If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory(){
  inquirer.prompt({
    type: 'input',
    name: 'item_id',
    message: 'Which product would you like to add more of? Please enter the item_id.'
  }).then(function(answer){
    var itemSelected = answer.item_id
    inquirer.prompt({
      type: 'input',
      name: 'quantity',
      message: 'How many of item ' + itemSelected + ' would you like to add?'
    }).then(function(quantitySelected){
      var quantityEntered = quantitySelected.quantity
      quantity = parseInt(quantityEntered)
      //Check if the value entered was a number, and if it is, update the database
      if (typeof quantity == 'number' && quantity >= 0) {

        //Query the database in order to find the existing value of the item quantity
        connection.query('SELECT stock_quantity FROM products WHERE item_id = ?',[itemSelected], function(error, results){
          for (var i = 0; i < results.length; i++) {
            var databaseQuantity = results[i].stock_quantity;
            initialQuantity = parseInt(databaseQuantity)
          }
        });
        newQuantity = initialQuantity + quantity;
        //Add this item to the database
        console.log(initialQuantity + ' initialQuantity');
        console.log('new quantity entered ' + quantity);
        console.log('newQuantity ' + newQuantity);
        // connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[newQuantity,itemSelected], function(error, results){
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Item ' + itemSelected + ' has been increased by a quantity of ' + quantity);
        //   }
        //     endConnection();
        // })
      } else {
        console.log("Please enter a valid quantity");
      }
    })
  })
}
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function addnewProduct(){

}

//End SQL connection
function endConnection(){
    connection.end();
}
