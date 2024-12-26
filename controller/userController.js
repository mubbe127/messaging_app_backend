import { validationResult } from "express-validator";
import {
  validateUser,
  checkExistingUser,
} from "../validation/userValidation.js";

import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import prisma from "../model/prismaClient.js";
import bcrypt from "bcryptjs";
import passport from "../middlewares/authMiddleware.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifysAccessToken
} from "../services/tokenUtils.js";

export const createUser = [
  validateUser,
  async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors);
    }

    const { username, firstname, lastname, email, password } = req.body;

    try {
      const conflictFields = await checkExistingUser(username, email);

      if (conflictFields) {
        return res.status(409).json(conflictFields);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          firstname,
          lastname,
          email,
          password: hashedPassword,
        },
      });

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateAccessToken(user.id)

      res.status(201).json({
        message: "User created successfully",
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
];

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.status(201).json({ users: users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a single user by ID
export const getUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const updateUser = [
  validateUser,
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors);
    }
    const userId = Number(req.params.userId);
    const { username, firstname, lastname, email, password, profileImage } =
      req.body;
    try {
      const conflictFields = await checkExistingUser(username, email, userId);
      if (conflictFields) {
        return res.status(409).json(conflictFields);
      }
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username,
          firstname,
          lastname,
          email,
          password,
          profileImage,
        },
      });

      // Logic for updating user
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },
];

export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getUserChats = async (req, res) => {
  const userId = Number(req.params.userId); // Ensure userId is a number

  // Fetch only memberOfChats related to the user
  const userChats = await prisma.user.findUnique({
    where: {
      id: userId, // Filter by userId
    },
    select: {
      memberOfChats: true, // Only select the memberOfChats data
    },
  });

  // Send the response
  res.json(userChats);
};

export const loginUser = async (req, res, next) => {
  try {
    // Check if username and passowrd is provided in the request
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Using Prisma to query the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Comparing password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // Generate JWT token ///IMPORT
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(err);
    next(err); // Pass error to error handling middleware
  }
};

export const refreshUserToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  const verifiedToken = await verifyRefreshToken(refreshToken)
  if(!verifiedToken){
    return res.status(401).json({ message: "Could not verify refresh token" });
  }
  const userId = verifiedToken.sub
  const token = await prisma.token.findUnique({
    where: { userId },
  });
  if (!token) {
    return res.status(403).json({ message: "Token not found in store" });
  }

  const match = await bcrypt.compare(refreshToken, token.refreshToken);

  // CHECK DATABASE
  if (!match) return res.status(403).json({ message: "Invalid refresh token" });
  try {
    
    const newAccessToken = generateAccessToken(user.sub); // Generate new access token
    res.status(201).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = jwtDecode(refreshToken).sub;
  if (refreshToken) {
    try {
      const deleteToken = await prisma.token.delete({
        where: {
          userId,
        },
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(401).json({ message: "Failed removing token" });
    }
  } // Remove refresh token from DB
};
