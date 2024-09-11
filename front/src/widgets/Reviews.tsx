import { useQuery } from "@tanstack/react-query";
import { fetchReviewList } from "@/api/review";
import ReviewCard from "@/features/review/ReviewCard";
import { ReviewInfo } from "@/shared/types/interface";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function Reviews() {
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => fetchReviewList(kakaoId),
  });

  if (error) return <div>에러: {error.message}</div>;
  if (isLoading) return <div>로딩 중...</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {reviews?.map((review: ReviewInfo, index: number) => (
        <ReviewCard key={index} reviewData={review} />
      ))}
    </div>
  );
}
