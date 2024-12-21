const paymentService = require("../vnpay/vnpay.service");

const vnpayIpn = async (req, res) => {
    try {
        const params = req.query; // hoặc req.body nếu bạn sử dụng POST
        const response = await paymentService.processVnpayIpn(params);
        // Kiểm tra mã phản hồi và gửi mã trạng thái hợp lệ
        if (response.rspCode === "00") {
            return res.status(200).json(response); // Trả về mã 200 cho thành công
        } else {
            return res.status(404).json(response); // Trả về mã 400 cho lỗi
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            RspCode: "97",
            Message: "Internal server error"
        }); // Trả về mã 500 cho lỗi máy chủ
    }
};
module.exports = {
    vnpayIpn,
};
