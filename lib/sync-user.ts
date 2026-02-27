import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const syncCurrentUser = async () => {
  try {
    //Get user data from clerk
    const clearkUser = await currentUser();

    if (!clearkUser) {
      return null;
    }

    const email = clearkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    //Check if user exists in db
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clearkUser.id },
    });

    if (dbUser) {
      //Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: `${clearkUser.firstName || ""} ${clearkUser.lastName || ""}`.trim(),
          image: clearkUser.imageUrl,
        },
      });
    } else {
      // Create a new user in database
      //Check if this is the first user make them admin
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clearkUser.id,
          email,
          name: `${clearkUser.firstName || ""} ${clearkUser.lastName || ""}`.trim(),
          image: clearkUser.imageUrl,
          role: isFirstUser ? "admin" : "user",
        },
      });
      console.log(`New user created: ${email} with role: ${dbUser.role}`);
    }
    return dbUser;
  } catch (error) {
    console.error("Error suncing user from Clerk:", error);
    throw error;
  }
};
