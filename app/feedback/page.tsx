import GradientHeader from "@/components/layout/GradientHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Map, PlusIcon } from "lucide-react";
import Link from "next/link";
import { getCategoryDesign } from "../data/category-data";
import { Badge } from "@/components/ui/badge";
import FeedbackList from "@/components/layout/FeedbackList";

const Feedback = async () => {
  //Get user id
  const { userId } = await auth();

  const post = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const category = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });

  return (
    <>
      <div className="space-y-6">
        <GradientHeader
          title="Community Feedback"
          subtitle="Explore, vote, and contribute to the features that matter most. Your voice shapes our product's future."
        >
          <div className="flex gap-4 justify-center pt-4">
            <Button
              asChild
              size={"lg"}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href={"/feedback/new"}>
                <PlusIcon className="w-4 h-4 ml-2" />
                New Feedback
              </Link>
            </Button>
            <Button
              asChild
              size={"lg"}
              className="bg-white text-black hover:bg-gray-100"
            >
              <Link href={"/roadmap"}>
                View Roadmap <Map className="w-4 h-4 ml-2" />{" "}
              </Link>
            </Button>
          </div>
        </GradientHeader>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SideBar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse feedback by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.map((cat) => {
                    const design = getCategoryDesign(cat.category);
                    const Icon = design.icon;
                    return (
                      <div
                        key={cat.category}
                        className="grop flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${design.light} ${design.border} border`}
                          >
                            <Icon className={`h-4 w-4 ${design.text}`}></Icon>
                          </div>
                          <span className="font-medium text-sm">
                            {cat.category}
                          </span>
                        </div>
                        <Badge
                          variant={"secondary"}
                          className={`${design.light} ${design.text}`}
                        >
                          {cat._count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main */}
          <div className="lg:col-span-3">
            <FeedbackList initialPosts={post} userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Feedback;
