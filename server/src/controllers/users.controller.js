
import * as userService from "../service/users.service.js";

export const findUserByEmail = async (req, res, next) => {
  try {
    const email = req.params.email || req.body.email || req.query.email;
    const password = req.body.password || req.query.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required field: email"
      });
    }
    const user = await userService.getUserByEmail(email, password);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    if(user.password !==password){
      console.log(user.password , password);
      return res.status(401).json({
        message:"user is unauthorized",
      })
    }
    res.status(200).json({
      message: "User data retrieved successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        message: "Missing required fields: email, password, firstName, lastName, phone"
      });
    }

    const user = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    res.status(201).json({
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const users = await userService.getUser();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserByID(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json({
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.deleteUserByID(id);
    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

