"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
  PageHeader,
  SubmissionStatusBadge,
  CommentCard,
  AddCommentForm,
} from "@/components/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  MessageSquare,
  Calendar,
  Globe,
  Monitor,
  DollarSign,
  Clock,
  FolderOpen,
  AlertCircle,
  RefreshCw,
  Check,
  MessageCircle,
} from "lucide-react";
import { useContactSubmissionDetail } from "@/lib/hooks/use-contact-submission-detail.hook";
import { useAdminComments } from "@/lib/hooks/use-admin-comments.hook";
import { LoadingSpinner } from "@/components/layout/Loading";

/**
 * Contact Submission Detail Page
 * Displays complete submission information with comments and status management
 */
export default function ContactSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const {
    submission,
    isLoading: isLoadingSubmission,
    error: submissionError,
    refetch: refetchSubmission,
    updateStatus,
    isUpdatingStatus,
  } = useContactSubmissionDetail(submissionId);

  const {
    pinnedComments,
    regularComments,
    commentsCount,
    isLoading: isLoadingComments,
    error: commentsError,
    createComment,
    isCreating,
    refetch: refetchComments,
  } = useAdminComments("contact_submission", submissionId);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStatusUpdate = async (status: "new" | "read" | "responded") => {
    try {
      await updateStatus(status);
      toast.success(`Status updated to ${status}`);
      await refetchSubmission();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchSubmission(), refetchComments()]);
      toast.success("Data refreshed successfully");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCommentAdded = () => {
    refetchComments();
  };

  if (isLoadingSubmission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (submissionError || !submission) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {submissionError ||
              "The requested contact submission could not be found."}
          </p>
          <Button
            onClick={() => router.push("/admin/contact-submissions")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title={`Contact Submission from ${submission.name}`}
            description={`Submitted ${formatDistanceToNow(
              new Date(submission.createdAt),
              { addSuffix: true }
            )}`}
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/contact-submissions")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Status Management
                </span>
                <SubmissionStatusBadge status={submission.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Update Status:</span>
                <div className="flex gap-2">
                  {["new", "read", "responded"].map((status) => (
                    <Button
                      key={status}
                      variant={
                        submission.status === status ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(
                          status as "new" | "read" | "responded"
                        )
                      }
                      disabled={
                        isUpdatingStatus || submission.status === status
                      }
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{submission.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{submission.email}</p>
                  </div>
                </div>
                {submission.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{submission.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Message Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.subject && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subject</p>
                  <p className="font-medium text-lg">{submission.subject}</p>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {submission.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          {(submission.projectType ||
            submission.budget ||
            submission.timeline) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {submission.projectType && (
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Project Type</p>
                        <Badge variant="secondary" className="mt-1">
                          {submission.projectType}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {submission.budget && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <Badge variant="outline" className="mt-1">
                          {submission.budget}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {submission.timeline && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Timeline</p>
                        <Badge variant="outline" className="mt-1">
                          {submission.timeline}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(submission.createdAt), "PPpp")}
                    </p>
                  </div>
                </div>
                {submission.ipAddress && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">IP Address</p>
                      <p className="font-mono text-xs">
                        {submission.ipAddress}
                      </p>
                    </div>
                  </div>
                )}
                {submission.userAgent && (
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">User Agent</p>
                      <p className="text-xs text-gray-600 break-all">
                        {submission.userAgent}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({commentsCount})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingComments && (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              )}

              {commentsError && (
                <div className="text-center py-4">
                  <p className="text-sm text-red-600">{commentsError}</p>
                </div>
              )}

              {!isLoadingComments && !commentsError && (
                <>
                  {/* Pinned Comments */}
                  {pinnedComments.length > 0 && (
                    <div className="space-y-3">
                      {pinnedComments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))}
                      {regularComments.length > 0 && <Separator />}
                    </div>
                  )}

                  {/* Regular Comments */}
                  {regularComments.length > 0 && (
                    <div className="space-y-3">
                      {regularComments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))}
                    </div>
                  )}

                  {commentsCount === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                    </div>
                  )}
                </>
              )}

              {/* Add Comment Form */}
              <AddCommentForm
                onCreateComment={async (content, options) => {
                  await createComment(content, options);
                }}
                isCreating={isCreating}
                onCommentAdded={handleCommentAdded}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
