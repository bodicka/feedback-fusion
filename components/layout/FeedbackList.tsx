"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { PrismaPromise } from "@/generated/prisma/internal/prismaNamespace";
import { formatDistanceToNow } from "date-fns";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { Badge } from "../ui/badge";
import { getCategoryDesign } from "@/app/data/category-data";

const FeedbackList = ({
  initialPosts,
  userId,
}: {
  initialPosts: any[];
  userId: string | null;
}) => {
  const [post, setPost] = useState(initialPosts);

  return (
    <div className="space-y-4">
      {post.map((posts) => (
        <Card
          key={posts.id}
          className="hover:shadow-md transition-shadow border"
        >
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg">{posts.title}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <User className="w-3 h-3" />
                  {posts.author.name}
                  <span></span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(posts.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-1.5">
                {(() => {
                  const statusGroup =
                    STATUS_GROUPS[posts.status as keyof typeof STATUS_GROUPS];
                  if (!statusGroup) return null;
                  const StatusIcon = statusGroup.icon;
                  return (
                    <Badge
                      className={`${statusGroup.countColor} border ${statusGroup.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusGroup.title}
                    </Badge>
                  );
                })()}
                {(() => {
                  const design = getCategoryDesign(posts.category);
                  const Icon = design.icon;

                  return (
                    <Badge
                      className={`text-xs ${design.border} ${design.text} flex items-center gap-1`}
                      variant={"outline"}
                    >
                      <Icon className="w-3 h-3" />
                      {posts.category}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
