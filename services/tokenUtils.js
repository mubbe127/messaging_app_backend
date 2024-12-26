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
    return jwt.sign({sub:userId}, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    
  };
  
  // Function to generate refresh token
 export const generateRefreshToken = async(userId) => {
    const refreshToken = jwt.sign({sub:userId}, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });


    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const storeRefreshToken = await prisma.token.create({
        data: {
            refreshToken:hashedToken,
            userId
        }
    })
   
    return refreshToken;
  };


