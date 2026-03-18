"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { Badge } from "../ui/badge";
import { getCategoryDesign } from "@/app/data/category-data";
import { Button } from "../ui/button";
import { toast } from "sonner";

const FeedbackList = ({
  initialPosts,
  userId,
}: {
  initialPosts: any[];
  userId: string | null;
}) => {
  const [post, setPost] = useState(initialPosts);

  const handleVote = async (postId: number) => {
    if (!userId) {
      toast.error("Please sign in to vote on feedback");
      return;
    }

    const loadingToast = toast.loading("Submitting vote...");

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create vote");
      }

      const data = await response.json();

      toast.dismiss(loadingToast);
      toast.success(data.voted ? "Vote added!" : "Vote removed");

      setPost(
        post.map((posts) => {
          if (posts.id === postId) {
            const voteCount = posts.votes.length;
            return {
              ...posts,
              vote: data.vote
                ? [...posts, { userId }]
                : posts.votes.filter((v: any) => v.userId !== userId),
              _count: {
                votes: data.voted ? voteCount + 1 : voteCount - 1,
              },
            };
          }
          return posts;
        }),
      );
    } catch (error) {
      console.error("Faled to submit vote.", error);

      toast.dismiss(loadingToast);
      toast.error("Faled to submit vote. Please try again");
    }
  };

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
                  <span>|</span>
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
          <CardContent>
            <p className="text-muted-foreground mb-3">{posts.description}</p>
            <div className="flex items-center justify-between">
              <Button
                size={"sm"}
                onClick={() => handleVote(posts.id)}
                variant={"outline"}
                className="gap-2"
              >
                <ThumbsUp
                  className={`h-4 w-4 ${posts.votes.some((v: any) => v.userId === userId) ? "fill-current" : ""}`}
                />
                {posts.votes.length} Votes
              </Button>
              <div className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Comment
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
