import * as userService from "../service/users.service.js";
export const findUserByEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields: email, password" });
    }
    const result = await userService.authenticateUser(email, password);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    res.status(200).json({
      message: "User authenticated successfully",
      data: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
export const loginUser = findUserByEmail;
export const getMeController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userService.getMe(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, otp, role } = req.body || {};
    if (!email || !password || !firstName || !lastName || !otp) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, firstName, lastName, otp",
      });
    }
    const validotp = await userService.getSignupOtp(email);
    if (!validotp || validotp.otp != otp) {
      return res.status(401).json({
        message: "invalid otp",
      });
    } else {
      await userService.deleteSignupOtp(email);
    }
    const user = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: role || "USER",
    });
    res.status(201).json({
      message: "User created and verified successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const registerUser = createUser;
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and password are required" });
    }
    const validotp = await userService.getForgetPassOtp(email);
    if (!validotp || validotp.otp !== otp) {
      return res.status(401).json({
        message: "invalid otp",
      });
    } else {
      await userService.deleteForgetPassOtp(email);
    }
    await userService.processResetPassword(email, password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  try {
    const users = await userService.getUser();
    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const getUsers = getUser;
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserByID(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    const body = req.body || {};

    const user = await userService.updateUser(id, body);
    res.status(200).json({
      message: "User updated successfully",
      data: user,
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
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
