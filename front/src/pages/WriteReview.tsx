import PageTemplate from "@/shared/original-ui/PageTemplate";
import ReviewForm from "@/features/review/ReviewForm";

export default function WriteReview() {
  return (
    <PageTemplate pageName="리뷰 작성">
      <ReviewForm />
    </PageTemplate>
  );
}