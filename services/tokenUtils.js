import jwt from "jsonwebtoken";
import prisma from "../model/prismaClient.js";
import bcrypt from "bcryptjs";

// Secret keys (use environment variables in production)
const ACCESS_TOKEN_SECRET = "your_access_token_secret";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // Access tokens expire in 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh tokens expire in 7 days

// Function to generate access token
export const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Function to generate refresh token

//CONSIDER CHANGING SEVERAL TOKENS FOR ONE USER TO ALLOW AUTHENICATION IN MULTIPLE DEVICES

export const generateRefreshToken = async (userId) => {
  const emptyToken = await prisma.token.create({
    data: {
      userId
    },
  });
  const id = emptyToken.id
  const refreshToken = jwt.sign({ sub: userId, id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  console.log(userId);

  /*const existingToken = await prisma.token.findUnique({
      where:{
        userId
      }
    })

    if(existingToken) {
      const deleteToken= await prisma.token.delete({
        where: {
          userId
        }
      })
    } */
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  const storeRefreshToken = await prisma.token.update({
    where: {id},
    data: {
      refreshToken: hashedToken
    },
  });

  return refreshToken;
};


export const verifyAccessToken = (accessToken) => {
  try {
    const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    if (!user) {
      console.log("Access token invalid or empty");
      return false;
    }
    return user; 
  } catch (error) {
    console.log("Access token verification failed:", error.message);
    return false;
  }
};

export const verifyRefreshToken = (refreshToken) => {
  try {
    console.log("Verifying refresh token");
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return user;
  } catch (error) {
    console.log("Refresh token verification failed:", error.message);
    return false; 
  }
};