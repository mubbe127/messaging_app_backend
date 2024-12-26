// userService.js


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