import GradientHeader from "@/components/layout/GradientHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import prisma from "@/lib/prisma";
import { BarChart3, CheckCheck, Clock, Target } from "lucide-react";
import { STATUS_GROUPS, STATUS_ORDER } from "../data/status-data";
import { Badge } from "@/components/ui/badge";

function getStatusPercentage(posts: any[], status: string) {
  const total = posts.length;
  const count = posts.filter((p: { status: string }) => p.status === status);
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

const Roadmap = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
  });

  const groupedPosts = {
    under_review: posts.filter((p) => p.status === "under_review"),
    planned: posts.filter((p) => p.status === "planned"),
    in_projess: posts.filter((p) => p.status === "in_projess"),
    completed: posts.filter((p) => p.status === "completed"),
  };

  const totalVotes = posts.reduce((acc, post) => acc + post.votes.length, 0);
  const averageVotes =
    posts.length > 0 ? Math.round(totalVotes / posts.length) : 0;

  // Calculate progress for the overall roadmap
  const completedPercentage = getStatusPercentage(posts, "completed");
  const inProgressPercentage = getStatusPercentage(posts, "is_projess");
  const planedPercentage = getStatusPercentage(posts, "planned");

  return (
    <div className="space-y-8">
      <GradientHeader
        title="Product Roadmap"
        subtitle="See what we're working on, what's coming next, and track our progress"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              <Target className="h-20 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-3xl font-bold">{totalVotes}</p>
              </div>
              <BarChart3 className="h-20 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">
                  {groupedPosts.completed.length}
                </p>
              </div>
              <BarChart3 className="h-20 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Votes</p>
                <p className="text-3xl font-bold">{averageVotes}</p>
              </div>
              <BarChart3 className="h-20 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Roudmap Progress</CardTitle>
          <CardDescription>
            Track the journey from idea to completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-medium">{completedPercentage}</span>
            </div>
            <Progress value={completedPercentage} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {inProgressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {planedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-600">
                {completedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="lg:grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        {STATUS_ORDER.map((status) => {
          const group = STATUS_GROUPS[status as keyof typeof STATUS_GROUPS];
          const Icon = group.icon;
          const postInGroup = groupedPosts[status as keyof typeof groupedPosts];
          return (
            <div key={status} className="space-y-4">
              <div
                className={`rounded-lg p-4 ${group.bgColor} border ${group.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${group.textColor}`} />
                    <h2 className={`text-lg font-semibold ${group.textColor}`}>
                      {group.title}
                    </h2>
                  </div>
                  <Badge className={group.countColor} variant={"secondary"}>
                    {postInGroup.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <div className="space-y-3">
                {postInGroup.map((post) => (
                  <Card
                    key={post.id}
                    className={`border-l-4 ${group.color} transition-all duration-200 hover:translate-y-1 cursor-pointer`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        {post.author.name} | {post.votes.length} votes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant={"outline"} className="text-xs">
                        {post.category}
                      </Badge>
                      {status === "in_projess" && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                          <Clock className="w-3 h-3" />
                          Active
                        </div>
                      )}
                      {status === "completed" && (
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <CheckCheck className="w-3 h-3" />
                          Shipped
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {postInGroup.length === 0 && (
                  <Card className="border-dashed opacity-60">
                    <CardContent className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No items in this stage
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
