import { Request, Response } from "express";
const groceryService = require("../services/grocery");

interface User {
  username: string;
  password: string;
  email: string;
  userType: "Admin" | "User";
}

interface Item {
  name: string;
  price: number;
  quantity: number;
}

const addGroceryItems = async (req: Request, res: Response) => {
  try {
    const items = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: "Invalid request format. Expecting an array of items.",
      });
    }

    const addItemResult = await groceryService.addGroceryItems(items);

    if (addItemResult?.success) {
      res.status(200).json(addItemResult);
    }
  } catch (error) {
    console.error("Error adding items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGroceryItems = async (req: Request, res: Response) => {
  try {
    const getItemsResult = await groceryService.getGroceryItems();

    if (getItemsResult?.success) {
      res.status(200).json(getItemsResult);
    }
  } catch (error) {
    console.error("Error getting grocery items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAvailableItems = async (req: Request, res: Response) => {
  try {
    const getItemsResult = await groceryService.getAvailableItems();

    if (getItemsResult?.success) {
      res.status(200).json(getItemsResult);
    }
  } catch (error) {
    console.error("Error getting grocery items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeGroceryItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.query.id;
    const removeItemResult = await groceryService.removeGroceryItem(itemId);

    res.status(200).json(removeItemResult);
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateGroceryItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.query.id;
    const item = req.body;
    const updateResult = await groceryService.updateGroceryItem(item, itemId);

    if (updateResult?.success) {
      res.status(200).json(updateResult);
    } else {
      res.status(200).json(updateResult);
    }
  } catch (error) {
    console.error("Error updating grocery item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signUpUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const signUpResponse = await groceryService.signUpUser(userData);
    const { success } = signUpResponse;

    if (success) {
      res.status(200).json(signUpResponse);
    } else {
      res.status(400).json(signUpResponse);
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;

    const orderDetailResponse = await groceryService.getOrderDetail(orderId);
    if (orderDetailResponse?.success) {
      res.status(200).json(orderDetailResponse);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error retrieving order information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order details" });
    }

    const orderCreationResult = await groceryService.createOrder(userId, items);
    if (orderCreationResult?.success) {
      res.status(201).json(orderCreationResult);
    } else {
      res.status(500).json(orderCreationResult);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addGroceryItems,
  signUpUser,
  getGroceryItems,
  removeGroceryItem,
  updateGroceryItem,
  createOrder,
  getOrderDetail,
  getAvailableItems,
};
