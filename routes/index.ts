const db = require( '../db.connection')
const express = require( 'express');
const router = express.Router()
const groceryController = require('../controllers/grocery')
const authenticate = require('../middleware/authenticate')

//API to create a user.
router.post('/signup', groceryController.signUpUser);

//Add new grocery items to the system
router.post('/items',authenticate, groceryController.addGroceryItems);

//View existing grocery items
router.get('/items', authenticate, groceryController.getGroceryItems);

//Remove grocery items from the system
router.delete('/items', authenticate, groceryController.removeGroceryItem);

//Update details of existing grocery items
router.put('/items', authenticate, groceryController.updateGroceryItem);

//View the list of available grocery items
router.get('/available/items', authenticate, groceryController.getAvailableItems);


//Ability to book multiple grocery items in a single order
router.post('/orders', authenticate, groceryController.createOrder );
router.get('/orders/:orderId', authenticate, groceryController.getOrderDetail);

module.exports = router
