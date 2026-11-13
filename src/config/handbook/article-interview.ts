import type { Article } from "./article-types";

export const articleInterview: Article = {
  slug: "ky-nang-phong-van",
  title: "Kỹ năng phỏng vấn IT: từ vòng gửi xe đến offer",
  summary:
    "Quy trình phỏng vấn của công ty công nghệ, 20 câu hỏi thường gặp kèm cách trả lời, và cách xử lý khi không biết đáp án.",
  category: "Phỏng vấn",
  readingTime: "11 phút đọc",
  updatedAt: "2026",
  intro:
    "Phỏng vấn IT gồm nhiều vòng với mục tiêu khác nhau. Hiểu mỗi vòng đang kiểm tra điều gì sẽ giúp bạn chuẩn bị đúng trọng tâm thay vì học tràn lan.",
  sections: [
    {
      heading: "1. Các vòng phỏng vấn và điều họ thực sự đánh giá",
      list: [
        {
          title: "Vòng sàng lọc (HR / 15–30 phút)",
          desc: "Kiểm tra thông tin CV, mức lương mong muốn, thời gian onboard và động lực ứng tuyển. Trả lời ngắn, trung thực, đúng trọng tâm.",
        },
        {
          title: "Vòng kỹ thuật (45–90 phút)",
          desc: "Đánh giá kiến thức nền, khả năng đọc hiểu code và tư duy giải quyết vấn đề. Đây là vòng quyết định.",
        },
        {
          title: "Vòng live coding / bài tập về nhà",
          desc: "Không chỉ xem đúng sai mà xem cách bạn đặt vấn đề, đặt tên biến, xử lý edge case và nói ra suy nghĩ.",
        },
        {
          title: "Vòng system design (mid–senior)",
          desc: "Kiểm tra khả năng phân rã hệ thống, chọn trade-off và giải thích quyết định kỹ thuật.",
        },
        {
          title: "Vòng văn hoá & leadership",
          desc: "Đánh giá cách bạn phối hợp, xử lý xung đột và nhận feedback.",
        },
      ],
      tip: {
        label: "Lưu ý",
        text: "Luôn hỏi HR ở đầu buổi: “Vòng này tập trung vào phần nào?” — chuẩn bị đúng trọng tâm hiệu quả hơn nhiều.",
      },
    },
    {
      heading: "2. Câu hỏi kỹ thuật thường gặp (Frontend)",
      list: [
        {
          title: "Closure là gì? Cho ví dụ thực tế.",
          desc: "Giải thích hàm ghi nhớ scope nơi nó sinh ra; ví dụ debounce, counter, module pattern.",
        },
        {
          title: "Event loop hoạt động thế nào?",
          desc: "Call stack → microtask (Promise) → macrotask (setTimeout). Nêu thứ tự thực thi khi có cả hai.",
        },
        {
          title: "useEffect khác useLayoutEffect ở đâu?",
          desc: "Thời điểm chạy sau/before paint; khi nào cần đồng bộ layout trước khi vẽ.",
        },
        {
          title: "Tại sao không nên dùng index làm key?",
          desc: "Re-render sai khi list thay đổi thứ tự, mất state của component con.",
        },
        {
          title: "Làm sao tối ưu một trang bị chậm?",
          desc: "Đo trước (Lighthouse/Performance tab) → tìm điểm nghẽn → lazy load, code split, memo, ảnh đúng kích thước.",
        },
        {
          title: "Phân biệt SSR, SSG, ISR, CSR",
          desc: "Thời điểm render, dữ liệu có thay đổi không, ảnh hưởng SEO và TTFB ra sao.",
        },
      ],
    },
    {
      heading: "3. Câu hỏi kỹ thuật thường gặp (Backend)",
      list: [
        {
          title: "Index trong database hoạt động thế nào?",
          desc: "Cấu trúc B-tree, khi nào index giúp và khi nào làm chậm ghi.",
        },
        {
          title: "Transaction và mức isolation",
          desc: "ACID, dirty read, phantom read, khi nào cần khoá chặt.",
        },
        {
          title: "JWT và session khác nhau thế nào?",
          desc: "Stateless vs stateful, thu hồi token, rủi ro XSS/CSRF, httpOnly cookie.",
        },
        {
          title: "Thiết kế API phân trang cho 1 triệu bản ghi",
          desc: "Offset vs cursor pagination, trade-off hiệu năng và tính nhất quán.",
        },
        {
          title: "Làm sao chống gửi trùng request?",
          desc: "Idempotency key, unique index, transaction, khoá ở tầng payment.",
        },
        {
          title: "Xử lý tác vụ nặng (gửi email, resize ảnh)",
          desc: "Đẩy vào queue (BullMQ/SQS), worker xử lý, retry với backoff.",
        },
      ],
    },
  ],
  checklist: [
    "Đọc lại JD và map từng yêu cầu với kinh nghiệm của bạn",
    "Ôn lại kiến thức nền của stack ghi trong JD",
    "Chuẩn bị 3 câu chuyện STAR về dự án đã làm",
    "Luyện nói to khi giải bài — interviewer cần nghe suy nghĩ",
    "Chuẩn bị sẵn 2–3 câu hỏi cho nhà tuyển dụng",
    "Kiểm tra camera, micro, mạng nếu phỏng vấn online",
    "Gửi email cảm ơn trong 24 giờ sau buổi phỏng vấn",
  ],
  relatedJobsQuery: "/search",
};
