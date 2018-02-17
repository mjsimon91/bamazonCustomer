
-- Create the Database bamazon--
CREATE DATABASE bamazon_db;

-- Creating a products table in the bamazon_db --
USE bamazon_db;

CREATE TABLE products (
  item_id int NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity int NULL,
  PRIMARY KEY (item_id)
);

-- Start the item_id value at 1000 --
ALTER TABLE products
AUTO_INCREMENT=1000

--Inserting the values into the database
INSERT INTO products(product_name, department_name, price, stock_quantity)
Values ("Sapiens: A Brief History of Humankind","Books",21.00,100),
("Coco","Movies",19.99,100),
("Hamilton Original Broadway Cast Recording", "CD",21.96,100),
("TCL 43S305", "TV and Video", 279.99, 10),
("Bose QC35", "Headphones", 299.99,40),
("Poly and Bark Sculpture Coffee Table in Walnut", "Furniture",303.10, 8),
("Nokia Steel – Activity & Sleep Watch","Sports and Outdoors", 129.95, 36),
("San Francisco Photography Cafe Zoetrope 8x10 inch Print","Art",28.00, 20),
("ChefSteps Joule Sous Vide", "Home and Kitchen", 199.99, 30),
("Amazon Echo Dot","Echo and Alexa", 29.99, 1000)
