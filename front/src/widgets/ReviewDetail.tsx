import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewById } from "@/api/review";
import { ReviewInfo, UserInfo } from "@/shared/types/interface";
import { API_URL } from "@/shared/constants";
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
} from "@/shared/shadcn-ui/carousel";
import ReviewActionBar from "@/widgets/ReviewActionBar";
import { fetchUserInfoById } from "@/api/interaction";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ReviewRatingSign from "@/features/review/ReviewRatingSign";
import { Badge } from "@/shared/shadcn-ui/badge";
import UserAvatar from "@/features/user/UserAvatar";

export default function ReviewDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get("reviewId");
  const kakaoId = useSelector((state: RootState) => state.userInfo.kakaoId);
  const {
    data: reviewInfo,
    isLoading,
    error,
  } = useQuery<ReviewInfo, Error>({
    queryKey: ["reviewInfo", reviewId],
    queryFn: () => fetchReviewById(reviewId as string, kakaoId),
    enabled: !!reviewId,
  });

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", reviewInfo?.authorId],
    queryFn: () => fetchUserInfoById(reviewInfo?.authorId as number),
    enabled: !!reviewInfo, // reviewInfo가 있을 때만 쿼리 실행
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {reviewInfo && (
        <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <a
                href={`/profile/${reviewInfo.authorId}`}
                className="flex items-center gap-2"
              >
                <UserAvatar
                  className="h-7 w-7"
                  profileImage={userInfo?.profileImage}
                  nickname={userInfo?.nickname}
                />
                <div className="text-sm line-clamp-1 text-gray-500 dark:text-gray-400">
                  {userInfo?.nickname}
                </div>
              </a>
              <ReviewRatingSign
                className="h-7 w-9 text-xl"
                rating={reviewInfo.rating}
              />
            </div>
            <div className="text-2xl font-bold">{reviewInfo.title}</div>
            <p className="text-md text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-all">
              {reviewInfo.reviewText}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-1.5">
            {reviewInfo?.tags.map((tag, index) => (
              <Badge key={index} className="cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4">
            <Carousel>
              <CarouselContent className="py-1">
                {reviewInfo.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={`${API_URL}/${image}`}
                      alt={`review Image-${index}`}
                      className="w-full h-full object-contain bg-muted rounded-md"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </Carousel>
            <ReviewActionBar isAuthor={reviewInfo.authorId === kakaoId} />
          </div>
        </div>
      )}
    </>
  );
}
