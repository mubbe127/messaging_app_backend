// userService.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../model/prismaClient.js";

export const checkIfUserExists = async (email, username) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });
};


export const generateToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET || "fluoguide", 
    { expiresIn: "1h" }
  );
};