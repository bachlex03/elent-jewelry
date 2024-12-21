const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Discount = require("../models/discount.model");

// Hàm cập nhật trạng thái hóa đơn
const updateInvoiceStatus = async (invoiceId, status) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: invoiceId },
            { status },
            { new: true } // `new: true` sẽ trả về tài liệu đã được cập nhật
        );
        return updatedInvoice;
    } catch (error) {
        console.log(error);
        return null; // Trả về null nếu có lỗi
    }
};

const getAllInvoicesByUserId = async (userId) => {
    try { 
        const invoices = await Invoice.find({ user: userId })
            .select('orderCode purchaseDate paymentMethod amountToPay status');
        return invoices;
    } catch (error) {
        throw new Error('Lỗi khi lấy hóa đơn: ' + error.message);
    }
};


const getInvoiceDetailsById = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        const invoiceUser = await User.findOne({ user: invoice.user.toString })
            .select('email')
            .populate({
                path: 'user_profile',
                model: 'Profile',
                select: 'firstName lastName phoneNumber',
            })
        const productDetails = []; // Lưu thông tin sản phẩm chi tiết

        for (const item of invoice.products) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error(`Sản phẩm với ID ${item.product} không tồn tại`);

            // Kiểm tra và sử dụng giá bán hoặc giá gốc
            const price = product.product_sale_price || product.product_price;

            // Tính số tiền cho từng sản phẩm và tổng cộng
            const itemTotal = price * item.quantity;

            // Thêm thông tin sản phẩm vào danh sách
            productDetails.push({
                product_id: product._id,
                name: product.product_name,
                price,
                quantity: item.quantity,
                itemTotal, // Tổng tiền cho sản phẩm này
            })
        }
        if (!invoiceUser) throw new Error("Người dùng không tồn tại");

        return {
            invoice,
            invoiceUser,
            productDetails
        }
    } catch (error) {
        throw new Error('Lỗi khi lấy thông tin hóa đơn: ' + error.message);
    }
};

const getInvoiceById = async(invoiceId)=>{
    try {
        const invoice = await Invoice.findById(invoiceId);
        return invoice
    } catch (error) {
        console.log(error)
        throw new Error('Lỗi khi lấy thông tin hóa đơn: ' + error.message);
    }
}

module.exports = {
    updateInvoiceStatus,
    getAllInvoicesByUserId,
    getInvoiceDetailsById,
    getInvoiceById,
}