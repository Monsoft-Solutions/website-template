"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin, Shield, MessageSquare } from "lucide-react";
import type { AdminCommentWithAuthor } from "@/lib/types/admin/admin-comment.type";

interface CommentCardProps {
  comment: AdminCommentWithAuthor;
  className?: string;
}

/**
 * Reusable comment card component for displaying admin comments
 * Shows comment content, author info, and metadata
 */
export function CommentCard({ comment, className }: CommentCardProps) {
  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`${className} ${
        comment.isPinned ? "border-blue-200 bg-blue-50/50" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.author.image || ""}
                alt={comment.author.name}
              />
              <AvatarFallback className="text-xs">
                {getAuthorInitials(comment.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{comment.author.name}</p>
                {comment.isPinned && <Pin className="h-3 w-3 text-blue-600" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {comment.author.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comment.isInternal && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Internal
              </Badge>
            )}
            {!comment.isInternal && (
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Public
              </Badge>
            )}
            {comment.isPinned && (
              <Badge variant="default" className="bg-blue-600">
                Pinned
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span>
                Updated{" "}
                {formatDistanceToNow(new Date(comment.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
