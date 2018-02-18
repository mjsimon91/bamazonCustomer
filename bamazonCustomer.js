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

//Define the Questions
var questions = [{
  type: 'input',
  name: 'item_id',
  message: 'Which product would you like to buy? Please enter the item_id.'
}, {
  type: 'input',
  name: 'quantity',
  message: 'How many would you like to order?'
}];

//Store the values from the queries
var id;
var storeQuantity;
var productPrice;
var productSelected;

//Connect to the database
connection.connect(function(error){
  if (error) throw error;
});

//Run the application
whichProduct();

// // Using inquirer to ask them the ID of the product they would like to buy.
function whichProduct(){
  inquirer.prompt(questions[0]).then(function(answer){
    productSelected = answer.item_id
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: answer.item_id }, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        id = res[i].item_id;
        storeQuantity = res[i].stock_quantity
        productPrice = res[i].price
        // console.log(productSelected);
        console.log("Product Name: " + res[i].product_name + "\nDepartment Name: " + res[i].department_name + "\nPrice: " + productPrice + "\nQuantity: " + storeQuantity );
      }
      howMany();
    });
  });
}
//   * The second message should ask how many units of the product they would like to buy.
function howMany(){
  inquirer.prompt(questions[1]).then(function(answer){
    var quantityRemaining = storeQuantity - answer.quantity;
    if (quantityRemaining > -1) {
      var totalPrice = answer.quantity * productPrice;
      console.log(typeof totalPrice);
      connection.query('UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE item_id = ?', [quantityRemaining, totalPrice, productSelected], function (error, results, fields){
        if (error) {
          console.log(error);
        } else
        console.log('The order has been placed!');
        console.log('Your total cost will be ' + totalPrice);

        connection.end();

      });
    } else {
      console.log('Insufficient quantity!');
    }

    console.log('Quantity Remianing ' + quantityRemaining);
  });
}
