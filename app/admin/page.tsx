import AdminFeedbackTable from "@/components/layout/AdminFeedbackTable"
import GradientHeader from "@/components/layout/GradientHeader";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <GradientHeader
        title="Admin Dashboard"
        subtitle="Manage feedbacks and update their status"
      />
      <AdminFeedbackTable posts={posts} />
    </div>
  );
};

export default AdminPage;
