// "nodemon server.js"로 서버 가동
import express from "express"; // 서버 구축용 프레임워크
import cors from "cors"; // cors 관리
import morgan from "morgan"; // 로그 출력용
import "dotenv/config"; // .env 파일에서 바로 환경 변수 로드
import cookieParser from "cookie-parser";
import {
  getReviews,
  getReviewsById,
  createReview,
  updateReview,
  deleteReview,
} from "./controllers/Review.js";
import {
  getKakaoToken,
  verifyKakaoAccessToken,
  refreshKakaoAccessToken,
  getKakaoUserInfo,
  logOutKakao,
  updateKakaoUserNickname,
  deleteUserAccount,
} from "./controllers/KakaoLogin.js";
import {
  getLikes,
  getComments,
  addLike,
  addComment,
  cancelLike,
  deleteComment,
  fetchUserInfoById,
} from "./controllers/Interaction.js";

const app = express(); // express 인스턴스 생성
const { PORT } = process.env; // 로드된 환경변수는 process.env로 접근 가능

// 미들웨어 설정
app.use(express.json()); //json 데이터 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터(x-www-form-urlencoded) 파싱(extended 옵션 정의 안해주면 에러 터짐)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // cors 에러 방지
app.use(morgan("dev")); // 로그 출력
app.use("/public", express.static("public")); // url을 통해 public 폴더의 파일들에 접근 가능하게 함
app.use(cookieParser()); // cookie 파싱

// 카카오 로그인 관련 API
app.post("/login/kakao", getKakaoToken); // 카카오 토큰 요청 API
app.post("/auth/kakao/refresh", refreshKakaoAccessToken); // 카카오 액세스 토큰 재발급 API
app.get("/auth/kakao/user", verifyKakaoAccessToken, getKakaoUserInfo); // 카카오 유저 정보 조회 API
app.post("/logout/kakao", verifyKakaoAccessToken, logOutKakao); // 카카오 로그아웃 API
app.post(
  "/auth/kakao/updateUserNickname",
  verifyKakaoAccessToken,
  updateKakaoUserNickname
); // 카카오 유저 닉네임 수정 API

// 리뷰 관련 API
app.get("/review", getReviews); // 리뷰 전체 조회 API
app.get("/review/:id", getReviewsById); // 특정 리뷰 조회 API
app.post("/review", verifyKakaoAccessToken, createReview); // 리뷰 등록 API
app.patch("/review/:id", verifyKakaoAccessToken, updateReview); // 리뷰 수정 API
app.delete("/review/:id", verifyKakaoAccessToken, deleteReview); // 리뷰 삭제 API

// 유저 상호 작용 API
app.get("/like/:id", getLikes); // 리뷰 추천 조회 API
app.get("/comment/:id", getComments); // 리뷰 댓글 조회 API
app.post("/like/:id", verifyKakaoAccessToken, addLike); // 리뷰 추천 API
app.post("/comment/:id", verifyKakaoAccessToken, addComment); // 리뷰 댓글 등록 API
app.delete("/like/:id", verifyKakaoAccessToken, cancelLike); // 리뷰 추천 취소 API
app.delete("/comment/:id", verifyKakaoAccessToken, deleteComment); // 리뷰 댓글 삭제 API
app.post(
  "/auth/kakao/deleteUserAccount",
  verifyKakaoAccessToken,
  deleteUserAccount
); // 카카오 유저 계정 삭제 API
app.get("/user/:id", fetchUserInfoById); // 유저 정보 조회 API

app.listen(PORT, () => console.log(`${PORT} 서버 기동 중`));
