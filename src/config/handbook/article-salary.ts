import type { Article } from "./article-types";

export const articleSalary: Article = {
  slug: "muc-luong-it-2026",
  title: "Mức lương IT 2026: mặt bằng và cách deal lương",
  summary:
    "Khoảng lương theo cấp bậc cho các vị trí phổ biến, cách xác định mức kỳ vọng và 5 câu hỏi để deal lương tự tin.",
  category: "Lương",
  readingTime: "9 phút đọc",
  updatedAt: "2026",
  intro:
    "Mức lương IT phụ thuộc vào ba biến số: cấp bậc, stack và loại công ty. Nắm được khoảng giá trị thị trường giúp bạn không tự bán rẻ mình — và cũng không đưa ra con số khiến nhà tuyển dụng loại hồ sơ ngay.",
  sections: [
    {
      heading: "1. Mặt bằng tham khảo theo cấp bậc (đơn vị: triệu VND/tháng)",
      paragraphs: [
        "Số liệu tổng hợp từ tin tuyển dụng công khai và khảo sát lương, áp dụng cho các thành phố lớn. Chênh lệch giữa công ty outsource và product company có thể lên tới 40%.",
      ],
      list: [
        {
          title: "Fresher / Intern",
          desc: "6 – 12 triệu. Chưa có kinh nghiệm thực tế, được đào tạo thêm tại công ty.",
        },
        {
          title: "Junior",
          desc: "12 – 20 triệu. Làm được task có hướng dẫn, cần review thường xuyên.",
        },
        {
          title: "Middle",
          desc: "20 – 35 triệu. Tự chủ feature, review code cho junior, làm việc trực tiếp với khách hàng.",
        },
        {
          title: "Senior",
          desc: "35 – 60 triệu. Thiết kế giải pháp, dẫn dắt technical, ảnh hưởng nhiều team.",
        },
        {
          title: "Lead / Manager",
          desc: "55 – 90+ triệu. Quản lý con người và kiến trúc, chịu trách nhiệm kết quả cuối cùng.",
        },
      ],
      tip: {
        label: "Lưu ý",
        text: "Đây là khoảng tham khảo, không phải chuẩn cố định. Công ty nước ngoài trả theo USD thường cao hơn 20–50% so với cùng cấp bậc.",
      },
    },
    {
      heading: "2. Stack nào đang trả cao hơn",
      list: [
        {
          title: "Nhóm cao nhất",
          desc: "ML/AI Engineer, Data Engineer, Security Engineer, Solution Architect — nhu cầu cao, nguồn cung thấp.",
        },
        {
          title: "Nhóm ổn định và dễ tìm việc",
          desc: "Fullstack TypeScript (React + Node.js), Backend Java/.NET, DevOps/Cloud.",
        },
        {
          title: "Yếu tố nâng lương mạnh nhất",
          desc: "Tiếng Anh giao tiếp tốt (làm việc trực tiếp với khách nước ngoài) thường cộng 20–30% lương so với cùng năng lực kỹ thuật.",
        },
      ],
    },
    {
      heading: "3. Cách xác định con số kỳ vọng",
      list: [
        {
          title: "Bước 1 — Thu thập dữ liệu",
          desc: "Xem 10–15 tin tuyển dụng cùng vị trí, cùng cấp bậc ở các công ty tương đương. Ghi lại khoảng lương min–max.",
        },
        {
          title: "Bước 2 — Tính mức hiện tại của bạn theo thị trường",
          desc: "Không dựa vào lương công ty cũ. Dựa vào năng lực thực tế và khoảng giá trị bạn vừa thu thập.",
        },
        {
          title: "Bước 3 — Đặt khoảng, không đặt số tuyệt đối",
          desc: "Trả lời: “Em đang kỳ vọng khoảng X – Y, trong đó X là mức em sẵn sàng nhận nếu phúc lợi và môi trường tốt.”",
        },
        {
          title: "Bước 4 — Cộng các yếu tố phi lương",
          desc: "Bảo hiểm full lương, thưởng, remote, ngày phép, học bổng chứng chỉ đều có giá trị tiền thật. Đừng chỉ so con số gross.",
        },
      ],
    },
    {
      heading: "4. Năm câu hỏi để deal lương tự tin",
      list: [
        {
          title: "“Khoảng ngân sách cho vị trí này là bao nhiêu?”",
          desc: "Hỏi ngược trước khi nêu con số — biết khung để trả lời trong phạm vi hợp lý.",
        },
        {
          title: "“Ngoài lương gross, công ty có phụ cấp hoặc thưởng gì thêm?”",
          desc: "Nhiều công ty có thưởng performance 2–4 tháng lương/năm, cần tính vào tổng thu nhập.",
        },
        {
          title: "“Bảo hiểm được tính trên lương nào?”",
          desc: "Nhiều nơi đóng trên lương tối thiểu — chênh lệch thực nhận khá lớn.",
        },
        {
          title: "“Lộ trình tăng lương và review hiệu suất diễn ra thế nào?”",
          desc: "Cho thấy bạn quan tâm dài hạn, đồng thời biết được tốc độ tăng thực tế.",
        },
        {
          title: "“Nếu em đáp ứng tốt mức X thì mức lương có điều chỉnh được không?”",
          desc: "Đặt điều kiện cụ thể thay vì đòi chung chung.",
        },
      ],
      tip: {
        label: "Nguyên tắc",
        text: "Không nhận offer ngay trong buổi đầu. Xin 1–2 ngày để cân nhắc — đây là điều hoàn toàn bình thường và giúp bạn không quyết định vội.",
      },
    },
  ],
  checklist: [
    "Đã khảo sát ít nhất 10 tin tuyển dụng cùng vị trí/cấp bậc",
    "Xác định rõ mức sàn và mức mục tiêu của bản thân",
    "Đã tính cả thưởng, bảo hiểm, phụ cấp khi so sánh offer",
    "Chuẩn bị câu trả lời theo khoảng, không phải số tuyệt đối",
    "Chuẩn bị 2–3 câu hỏi về ngân sách và lộ trình tăng lương",
    "Không so sánh lương với đồng nghiệp cũ trước mặt nhà tuyển dụng",
    "Xin thời gian cân nhắc trước khi nhận offer",
  ],
  relatedJobsQuery: "/search",
};
