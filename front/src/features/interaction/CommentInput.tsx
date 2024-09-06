import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import UserProfile from "../user/UserProfile";
import { Button } from "@/shared/shadcn-ui/button";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { addComment } from "@/api/interaction";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentInput() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => addComment(id as string, comment),
    // 댓글 등록 성공 시, 댓글 목록 갱신
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setIsExpanded(false);
      await mutation.mutateAsync();
      setComment("");
    }
  };

  const handleCancel = () => {
    setComment("");
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex space-x-4">
        <UserProfile />
        <div className="flex-grow">
          <Textarea
            ref={textareaRef}
            placeholder="댓글 추가..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={handleFocus}
            className={`min-h-[40px] resize-none transition-all duration-200 ease-in-out ${
              isExpanded ? "min-h-[80px]" : "overflow-hidden"
            }`}
          />
          {isExpanded && (
            <div className="flex justify-end space-x-2 mt-2">
              <Button type="button" variant="ghost" onClick={handleCancel}>
                취소
              </Button>
              <Button type="submit" disabled={!comment.trim()}>
                등록
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}