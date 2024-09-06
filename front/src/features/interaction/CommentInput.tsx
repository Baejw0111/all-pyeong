import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import UserProfile from "@/features/user/UserProfile";
import { Button } from "@/shared/shadcn-ui/button";
import { Textarea } from "@/shared/shadcn-ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { addComment } from "@/api/interaction";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Send } from "lucide-react";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";

export default function CommentInput() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  if (isDesktop === null) return;

  if (isDesktop) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <UserProfile />
          <div className="flex-grow">
            <Textarea
              ref={textareaRef}
              placeholder="댓글 추가..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onFocus={handleFocus}
              className={`resize-none transition-all duration-200 ease-in-out ${
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

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed left-0 bottom-0 w-full p-4 bg-background border-t"
    >
      <div className="flex space-x-4">
        <UserProfile />
        <div className="flex-grow flex flex-row justify-between gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="댓글 추가..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setIsExpanded(false)}
            className={`min-h-9 h-9 resize-none transition-all duration-200 ease-in-out ${
              isExpanded ? "min-h-[80px]" : "overflow-hidden"
            }`}
          />
          <TooltipWrapper tooltipText="등록">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!comment.trim()}
            >
              <Send />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
    </form>
  );
}
