import React from "react";
import "./Home.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export function Home() {
    const userRole = useSelector((state) => state.authentication.userRole);
    const roleLabel =
        userRole === "TEACHER"
            ? "👨‍🏫 Bạn đang ở giao diện Giảng viên"
            : userRole === "STUDENT"
            ? "👨‍🎓 Bạn đang ở giao diện Học viên"
            : null;
    const navigate = useNavigate();
    return (
        <div className="home">
            {!userRole && (
                <>
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-start btn-right"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="btn-start btn-right btn-sign"
                    >
                        Đăng ký
                    </button>
                </>
            )}
            {roleLabel && <div className="role-tag">{roleLabel}</div>}
            <div className="hero">
                <h1>Học lập trình dễ dàng, mọi lúc mọi nơi</h1>
                <p>Tham gia hàng trăm khóa học từ cơ bản đến nâng cao cùng giảng viên giàu kinh nghiệm.</p>
                <button
                    onClick={() => navigate("/courses")}
                    className="btn-start"
                >
                    {userRole === "TEACHER" ? "Quản lý khóa học" : "Khám phá khóa học"}
                </button>
            </div>

            <div className="info-cards">
                <div className="card">
                    <h3>🎓 Giảng viên chất lượng</h3>
                    <p>Đội ngũ chuyên gia nhiều năm kinh nghiệm thực chiến tại doanh nghiệp.</p>
                </div>
                <div className="card">
                    <h3>⏰ Học linh hoạt</h3>
                    <p>Truy cập bài học mọi lúc mọi nơi chỉ cần Internet.</p>
                </div>
                <div className="card">
                    <h3>💬 Cộng đồng mạnh mẽ</h3>
                    <p>Hàng ngàn học viên cùng chia sẻ, trao đổi và hỗ trợ lẫn nhau.</p>
                </div>
            </div>

            <div className="marquee">
                <p>🔥 Cùng nhau học lập trình – Phát triển kỹ năng – Đạt được ước mơ! 🔥</p>
            </div>

            <div className="stats">
                <div className="stat">
                    <h2>10.000+</h2>
                    <p>Học viên đã tham gia</p>
                </div>
                <div className="stat">
                    <h2>200+</h2>
                    <p>Khóa học lập trình</p>
                </div>
                <div className="stat">
                    <h2>95%</h2>
                    <p>Học viên hài lòng</p>
                </div>
            </div>
            {/* <div class="reviews-section">
                <h2 class="section-title">Nhận xét của học viên</h2>
                <div class="review-cards">
                    <div class="review-card">
                        <p class="review-text">"Khóa học rất dễ hiểu và ứng dụng được ngay!"</p>
                        <p class="review-author">– Nguyễn Văn A</p>
                    </div>
                    <div class="review-card">
                        <p class="review-text">"Giảng viên tận tâm, nội dung sát với thực tế."</p>
                        <p class="review-author">– Trần Thị B</p>
                    </div>
                    <div class="review-card">
                        <p class="review-text">"Học online mà vẫn cảm thấy rất gần gũi."</p>
                        <p class="review-author">– Lê Văn C</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
