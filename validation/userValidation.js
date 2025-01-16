import { body } from "express-validator";
import {checkIfUserExists} from "../services/userServices.js";


export const validateUser = [
 
  body("username")
    .isLength({ min: 1, max: 80 })
    .withMessage(`Username must be at least 1 and max 80 characters long`),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .not()
    .isEmpty()
    .withMessage("Password is required"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("firstname").isAlpha().withMessage("Name must only contains letters"),
  body("lastname").isAlpha().withMessage("Name must only contains letters"),
];

export const validateUpdateUser = [
 
  body("username")
    .isLength({ min: 1, max: 80 })
    .withMessage(`Username must be at least 1 and max 80 characters long`),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("firstname").isAlpha().withMessage("Name must only contains letters"),
  body("lastname").isAlpha().withMessage("Name must only contains letters"),
];

export const checkExistingUser = async (username, email, updateUserId=undefined) => {

  const existingUser = await checkIfUserExists(email, username);

  if (existingUser) {
    const conflictFields = [];
    if (existingUser.email === email && existingUser.id!==updateUserId) {
      conflictFields.push({
        msg: "Email is already taken. Please choose another one.",
        path: "email",
      });
    }
    if (existingUser.username === username && existingUser.id!==updateUserId) {
      conflictFields.push({
        msg: "Username is already taken. Please choose another one.",
        path: "username",
      });
    }

    if (conflictFields.length > 0) {
      return conflictFields;
    } else return false;
  }
};
