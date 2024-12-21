const paymentService = require("../services/payment.service");
const confirmInforPayment = async (req, res) => {
  try {
    const { emailtoken, items, discount_id } = req.body; // Sử dụng items thay vì product_id và quantity
    // Kiểm tra xem items có hợp lệ không
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp danh sách sản phẩm.",
      });
    }

    // Gọi service để xử lý thông tin thanh toán
    const paymentResult = await paymentService.confirmInforPayment(
      emailtoken,
      items,
      discount_id
    );

    // Trả về kết quả cho frontend
    return res.status(200).json({
      success: true,
      message: "thành công",
      data: paymentResult,
    });
  } catch (error) {
    console.error("Lỗi :", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
const createPayment = async (req, res) => {
  try {
    const { email,address, otherAddress, paymentMethod, items, discount_id, totalAmount, discountApplied } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!email || !paymentMethod || !items || items.length === 0 || !totalAmount ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc cho thanh toán.",
      });
    }

    const paymentData = { email, address, otherAddress, paymentMethod, items, discount_id, totalAmount, discountApplied };
    
    const result = await paymentService.processPayment(paymentData);

    res.status(200).json({
      success: true,
      message: "Thanh toán thành công",
      data: result
    });
  } catch (error) {
    console.error("Lỗi trong createPayment:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

module.exports = {
  confirmInforPayment,
  createPayment,
};
