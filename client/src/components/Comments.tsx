import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { MessageCircle, Trash2, Reply } from "lucide-react";
import { toast } from "sonner";

interface CommentsProps {
  articleId: number;
  accentColor: string;
}

interface CommentWithUser {
  id: number;
  articleId: number;
  userId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string | null;
    email: string | null;
  } | null;
}

export default function Comments({ articleId, accentColor }: CommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: comments = [], refetch } = trpc.comments.list.useQuery({ articleId });
  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      refetch();
      setNewComment("");
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Comment posted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post comment");
    },
  });
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createComment.mutate({
      articleId,
      content: newComment.trim(),
    });
  };

  const handleSubmitReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    createComment.mutate({
      articleId,
      content: replyContent.trim(),
      parentId,
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment.mutate({ id: commentId });
    }
  };

  // Organize comments into parent-child structure
  const topLevelComments = comments.filter((c: CommentWithUser) => !c.parentId);
  const getReplies = (parentId: number) => 
    comments.filter((c: CommentWithUser) => c.parentId === parentId);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: CommentWithUser; isReply?: boolean }) => {
    const replies = getReplies(comment.id);
    const canDelete = user && (user.id === comment.userId || user.role === 'admin');

    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: accentColor }}
          >
            {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold">{comment.user?.name || 'Anonymous'}</span>
              <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
            </div>
            
            <p className="text-foreground leading-relaxed mb-3">{comment.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                  style={{ color: accentColor }}
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
              
              {canDelete && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || createComment.isPending}
                    style={{ backgroundColor: accentColor }}
                    className="text-white"
                  >
                    Post Reply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
              <div className="mt-4">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 pt-12 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6" style={{ color: accentColor }} />
        <h2 className="text-3xl font-['Playfair_Display'] italic">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="mb-12 space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px]"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || createComment.isPending}
            style={{ backgroundColor: accentColor }}
            className="text-white"
          >
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-12 p-6 border border-border rounded-lg text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to leave a comment
          </p>
          <Button asChild style={{ backgroundColor: accentColor }} className="text-white">
            <a href={getLoginUrl()}>Log In</a>
          </Button>
        </div>
      )}

      {/* Comments List */}
      {topLevelComments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {topLevelComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
