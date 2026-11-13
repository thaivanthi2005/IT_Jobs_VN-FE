import type { Article } from "./article-types";

export const articleCoverLetter: Article = {
  slug: "thu-xin-viec",
  title: "Thư xin việc (cover letter) cho developer",
  summary:
    "Có nên viết cover letter khi apply IT? Mẫu thư 150 từ hiệu quả và 3 tình huống nên gửi kèm CV.",
  category: "Thư xin việc",
  readingTime: "6 phút đọc",
  updatedAt: "2026",
  intro:
    "Phần lớn nhà tuyển dụng IT không đọc cover letter — nhưng khi họ đọc, nó có thể tạo khác biệt giữa hai CV tương đương. Viết ngắn, cụ thể, và chỉ gửi khi thật sự có nội dung đáng nói.",
  sections: [
    {
      heading: "1. Khi nào nên gửi kèm thư xin việc",
      list: [
        {
          title: "Nên gửi",
          desc: "Khi JD yêu cầu rõ ràng, khi bạn có điểm mạnh đặc biệt liên quan trực tiếp (dự án cùng domain, kinh nghiệm cùng stack), hoặc khi apply qua email trực tiếp cho hiring manager.",
        },
        {
          title: "Không bắt buộc",
          desc: "Khi apply qua form/ATS chỉ có ô upload CV và không có trường cover letter.",
        },
        {
          title: "Đừng gửi nếu",
          desc: "Bạn chỉ copy mẫu chung chung và thay tên công ty. Một thư chung chung làm giảm điểm nhiều hơn là không gửi.",
        },
      ],
    },
    {
      heading: "2. Cấu trúc 150 từ hiệu quả nhất",
      paragraphs: [
        "Nhà tuyển dụng không có thời gian đọc 500 từ. Hãy viết như một email ngắn cho đồng nghiệp tương lai: rõ ràng, có bằng chứng, không sáo rỗng.",
      ],
      list: [
        {
          title: "Câu 1 — Bạn apply vị trí nào và tại sao là công ty này",
          desc: "“Tôi apply vị trí Frontend Developer. Tôi theo dõi sản phẩm X của công ty từ 2024 và muốn góp phần vào phần dashboard đang mở rộng.”",
        },
        {
          title: "Câu 2–4 — Bằng chứng liên quan trực tiếp",
          desc: "Nêu 1–2 kết quả cụ thể trùng khớp với yêu cầu JD. Số liệu càng tốt. Không liệt kê lại toàn bộ CV.",
        },
        {
          title: "Câu 5 — Bạn có thể giúp gì trong 3 tháng đầu",
          desc: "“Với kinh nghiệm tối ưu LCP, tôi tin có thể giúp cải thiện tốc độ trang danh mục sản phẩm trong quý đầu.”",
        },
        {
          title: "Kết — Lời cảm ơn ngắn và thông tin liên hệ",
          desc: "Một câu. Không cần văn vẻ. Kèm link portfolio/GitHub nếu chưa có trong CV.",
        },
      ],
      tip: {
        label: "Giới hạn",
        text: "Tuyệt đối dưới 200 từ. Nếu dài hơn, đó là CV chứ không phải cover letter.",
      },
    },
    {
      heading: "3. Mẫu tham khảo (tiếng Việt)",
      paragraphs: [
        "Chào anh/chị [Tên hiring manager],",
        "Tôi là [Họ tên], apply vị trí [Vị trí] tại [Công ty]. Tôi đã dùng [Sản phẩm] hàng ngày và ấn tượng với cách team xử lý [điểm cụ thể].",
        "Trong 2 năm qua tôi làm Frontend tại [Công ty cũ], nơi tôi xây dựng [tính năng] bằng [stack] và tối ưu [chỉ số] từ [X] xuống [Y]. Đây là kỹ năng tôi thấy trùng khớp với yêu cầu [yêu cầu cụ thể trong JD] của vị trí.",
        "Trong 3 tháng đầu, tôi mong có thể [đóng góp cụ thể]. Portfolio của tôi: [link].",
        "Cảm ơn anh/chị đã dành thời gian đọc. Tôi sẵn sàng trao đổi thêm bất cứ lúc nào.",
      ],
      tip: {
        label: "Quan trọng",
        text: "Đổi tên công ty, sản phẩm, stack và số liệu cho khớp thực tế. Một thư copy-paste sẽ bị nhận ra ngay.",
      },
    },
    {
      heading: "4. Ba lỗi phổ biến",
      list: [
        {
          title: "Mở đầu bằng “Tôi tên là… và tôi rất yêu thích lập trình”",
          desc: "Sáo rỗng và không có thông tin. Vào thẳng vấn đề: vị trí nào, tại sao công ty này.",
        },
        {
          title: "Lặp lại toàn bộ nội dung CV",
          desc: "Thư chỉ nên bổ sung ngữ cảnh mà CV không thể hiện được.",
        },
        {
          title: "Không có thông tin liên hệ hoặc link portfolio",
          desc: "Kết thư phải có cách liên hệ lại rõ ràng.",
        },
      ],
    },
  ],
  checklist: [
    "Dưới 200 từ",
    "Nêu rõ vị trí ứng tuyển ngay câu đầu",
    "Có 1–2 bằng chứng cụ thể trùng với JD",
    "Có đề xuất đóng góp trong 3 tháng đầu",
    "Đã đổi tên công ty / sản phẩm / stack cho đúng",
    "Có ký tên và thông tin liên hệ",
    "Đọc lại để loại bỏ câu sáo rỗng",
  ],
  relatedJobsQuery: "/search",
};
