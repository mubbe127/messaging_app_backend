import { validationResult } from "express-validator";
import { validateUser } from "../validation/userValidation.js";
import * as userService from "../services/userService.js";


export const createUser = [
  validateUser,
  async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors);
    }

    const { username, firstname, lastname, email, password } = req.body;

    try {
      const existingUser = await userService.checkIfUserExists(email, username);

      if (existingUser) {
        const conflictFields = [];
        if (existingUser.email === email) {
          conflictFields.push({ msg: "Email is already taken. Please choose another one.", path: "email" });
        }
        if (existingUser.username === username) {
          conflictFields.push({ msg: "Username is already taken. Please choose another one.", path: "username" });
        }
        return res.status(409).json({conflictFields});
      }

      const hashedPassword = await userService.hashPassword(password);
      const user = await userService.createUserInDb({
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      const token = userService.generateToken(user.id);

      res.status(201).json({
        message: "User created successfully",
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
];