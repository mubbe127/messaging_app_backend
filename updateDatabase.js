import prisma from "./model/prismaClient.js";
import dotenv from 'dotenv';
const envFile = ".env.production"
   
dotenv.config({ path: envFile });



async function updateDb() {
  const updateUser = await prisma.user.update({
    where: {
      id: 1,
    },
    data: {
      membershipStatus: "admin",
    },
  });
}

updateDb()

