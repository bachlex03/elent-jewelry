const invoiceService = require('../services/invoice.service');
const processPayment = require('../vnpay/vnpay.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getAllInvoiceByUser =async (req,res)=>{
    const userId = req.query.userId;
    try {
        const invoices = await invoiceService.getAllInvoicesByUserId(userId);
        if (invoices.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn cho người dùng này' });
        }
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

const getInvoiceDetailsById = async (req, res) => {
    const invoiceId = req.query.invoiceId;
    try {
        const invoice = await invoiceService.getInvoiceDetailsById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn với ID này' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
const updateInvoiceById = async(req,res)=>{
    const invoiceId = req.query.invoiceId;
    const {status} = req.body; 
    try {
        const invoice = await invoiceService.updateInvoiceStatus(invoiceId , status);
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn với ID này' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    } 
}
const retryPayment = async (req, res) => {
    const { invoiceId } = req.query;

    try {
        // Lấy thông tin hóa đơn từ service
        const invoice = await invoiceService.getInvoiceById(invoiceId);
        if (invoice.status.toString() === 'success') {
            return res.status(400).json({ message: 'Hóa đơn không hợp lệ hoặc đã được thanh toán.' });
        }

        // Tạo URL thanh toán lại
        const paymentUrl = await processPayment.processPayment(invoice);

        return res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error("Lỗi khi thực hiện thanh toán lại:", error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi thực hiện thanh toán lại.' });
    }
};

module.exports = {
    getAllInvoiceByUser,
    getInvoiceDetailsById,
    updateInvoiceById,
    retryPayment,
}