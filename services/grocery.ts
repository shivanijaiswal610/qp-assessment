const db = require("../db.connection");
import jwt from "jsonwebtoken";

const addGroceryItems = async (items: any[]) => {
  try {
    const values = items.map((item) => [item.name, item.price, item.quantity]);

    const insertQuery = "INSERT INTO items (name, price, quantity) VALUES ?";
    await db.query(insertQuery, [values]);

    return { success: true, message: "Items added successfully" };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const signUpUser = async (user: any) => {
  try {
    const { username, password, email, userType } = user;

    const insertQuery =
      "INSERT INTO User (Username, Password, Email, UserType) VALUES (?, ?, ?, ?)";

    await db.query(insertQuery, [username, password, email, userType]);

    const token = jwt.sign(
      { username, userType },
      process.env.JWT_SECRET_TOKEN as string
    );

    return { success: true, message: "User inserted successfully", token };
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return { success: false, message: "Email address is already in use" };
    } else {
      return { success: false, message: "Internal server error" };
    }
  }
};

const getGroceryItems = async (req: Request, res: Response) => {
  try {
    const query = "SELECT * FROM items";
    const rows = await db.query(query);
    return {
      success: true,
      items: rows,
    };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const getAvailableItems = async () => {
  try {
    const query = "SELECT * FROM items WHERE quantity > 0";
    const items = await db.query(query);

    return { success: true, items };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const removeGroceryItem = async (itemId: number) => {
  try {
    const query = "DELETE FROM items WHERE id = ?";
    const result = await db.query(query, [itemId]);
    if (result && result.affectedRows > 0) {
      return { success: true, message: "Item have been deleted successfully" };
    } else {
      return { success: false, message: "Item does not exists" };
    }
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const updateGroceryItem = async (item: any, itemId: number) => {
  try {
    const { name, price, quantity } = item;
    const query =
      "UPDATE items SET name = ?, price = ?, quantity = ? WHERE id = ?";
    const result = await db.query(query, [name, price, quantity, itemId]);
    if (result && result.affectedRows > 0) {
      return { success: true, message: "Item have been updated successfully" };
    } else {
      return { success: false, message: "Item does not exist" };
    }
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const getOrderDetail = async (orderId: number) => {
  try {
    const orderQuery = "SELECT * FROM orders WHERE id = ?";
    const orderItemsQuery =
      "SELECT oi.*, i.name, i.price FROM order_items oi JOIN items i ON oi.item_id = i.id WHERE oi.order_id = ?";
    const [order] = await db.query(orderQuery, [orderId]);
    const items = await db.query(orderItemsQuery, [orderId]);

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, order, items };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

const createOrder = async (userId: number, items: any[]) => {
  try {
    const insertOrderQuery = "INSERT INTO orders (user_id) VALUES (?)";
    const result = await db.query(insertOrderQuery, [userId]);
    const orderId = result.insertId;
    for (const item of items) {
      const { itemId, quantity } = item;
      await db.query(
        "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
        [orderId, itemId, quantity]
      );
    }
    return { success: true, message: "Order created successfully", orderId };
  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
};

module.exports = {
  addGroceryItems,
  getGroceryItems,
  signUpUser,
  removeGroceryItem,
  updateGroceryItem,
  createOrder,
  getOrderDetail,
  getAvailableItems,
};
