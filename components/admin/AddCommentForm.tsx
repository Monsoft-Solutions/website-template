"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus, Pin, Shield } from "lucide-react";
import { toast } from "sonner";

interface AddCommentFormProps {
  onCommentAdded?: () => void;
  onCreateComment: (
    content: string,
    options?: { isInternal?: boolean; isPinned?: boolean }
  ) => Promise<void>;
  isCreating: boolean;
  className?: string;
}

/**
 * Form component for adding new admin comments
 * Supports internal/public and pinned comment options
 */
export function AddCommentForm({
  onCommentAdded,
  onCreateComment,
  isCreating,
  className,
}: AddCommentFormProps) {
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Comment content is required");
      return;
    }

    try {
      await onCreateComment(content, { isInternal, isPinned });

      // Reset form
      setContent("");
      setIsPinned(false);

      toast.success("Comment added successfully");

      onCommentAdded?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Add Comment
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="comment-content" className="text-sm font-medium">
              Comment
            </Label>
            <Textarea
              id="comment-content"
              placeholder="Add your comment here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 resize-none"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-internal"
                checked={isInternal}
                onCheckedChange={(checked) => setIsInternal(!!checked)}
                disabled={isCreating}
              />
              <Label
                htmlFor="is-internal"
                className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Shield className="h-4 w-4" />
                Internal comment (visible only to admins)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-pinned"
                checked={isPinned}
                onCheckedChange={(checked) => setIsPinned(!!checked)}
                disabled={isCreating}
              />
              <Label
                htmlFor="is-pinned"
                className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Pin className="h-4 w-4" />
                Pin this comment (show at top)
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              {isInternal ? (
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  This comment will be visible only to admin users
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  This comment will be public (if applicable)
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isCreating || !content.trim()}
              className="gap-2"
            >
              {isCreating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Comment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
