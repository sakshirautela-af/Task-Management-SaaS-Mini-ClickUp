import * as userService from "../service/users.service.js";

export const findUserByEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields: email, password" });
    }

    const result = await userService.authenticateUser(email, password);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.status(200).json({
      message: "User authenticated successfully",
      data: result.user,
      token: result.token
    });
  } catch (error) {
    next(error);
  }
};

export const sendSignupOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await userService.initiateSignup(email);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    res.status(200).json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, otp } = req.body || {};
    if (!email || !password || !firstName || !lastName || !otp) {
      return res.status(400).json({
        message: "Missing required fields: email, password, firstName, lastName, otp"
      });
    }

    const result = await userService.registerUser({
      email,
      password,
      firstName,
      lastName,
    }, otp);

    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }

    res.status(201).json({
      message: "User created and verified successfully.",
      data: result.user
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await userService.processForgotPassword(email);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.status(200).json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and newPassword are required" });
    }

    const result = await userService.processResetPassword(email, otp, newPassword);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

// Original basic CRUD operations
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
    const body = req.body || {};
    const user = await userService.updateUser(id, body);
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
