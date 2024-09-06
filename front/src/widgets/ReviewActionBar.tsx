import { Button } from "@/shared/shadcn-ui/button";
import { Share2, Trash2, Flag } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteReview } from "@/api/review";
import { useNavigate, useParams } from "react-router-dom";
import TooltipWrapper from "@/shared/original-ui/TooltipWrapper";
import LikeButton from "@/features/interaction/LikeButton";

export default function ReviewActionBar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: () => deleteReview(id as string),
    onSuccess: () => {
      console.log("리뷰 삭제 성공");
      alert("리뷰 삭제 성공");
      navigate("/");
    },
    onError: (error) => {
      console.error("리뷰 삭제 실패:", error);
      alert("리뷰 삭제 실패");
    },
  });

  return (
    <div className="flex items-center gap-2">
      <LikeButton />
      <TooltipWrapper tooltipText="공유">
        <Button variant="ghost" size="icon">
          <Share2 className="w-6 h-6" />
          <span className="sr-only">공유</span>
        </Button>
      </TooltipWrapper>
      <TooltipWrapper tooltipText="삭제">
        <Button variant="ghost" size="icon" onClick={() => mutate()}>
          <Trash2 className="w-6 h-6 hover:text-red-500" />
          <span className="sr-only">삭제</span>
        </Button>
      </TooltipWrapper>
      <TooltipWrapper tooltipText="신고">
        <Button variant="ghost" size="icon" className="ml-auto">
          <Flag className="w-6 h-6" />
          <span className="sr-only">신고</span>
        </Button>
      </TooltipWrapper>
    </div>
  );
}