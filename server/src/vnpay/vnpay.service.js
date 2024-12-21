
const crypto = require("crypto");
require('dotenv').config({ path: '.env.development' });
var querystring = require('qs');
const invoiceService = require('../services/invoice.service');

const processPayment = async (invoice) => {
    const date = new Date();
    const { default: dateFormat } = await import("dateformat");
    const createDate = dateFormat(date, "yyyymmddHHMMss");

    const RETURN_URL = process.env.VNP_RETURNURL;
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0'; 
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = Date.now().toString();
    vnp_Params['vnp_OrderInfo'] = invoice._id;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Amount'] = invoice.amountToPay * 100;
    vnp_Params['vnp_ReturnUrl'] = RETURN_URL;
    vnp_Params['vnp_IpAddr'] = '13.160.92.202';
    vnp_Params['vnp_CreateDate'] = createDate;
    // vnp_Params['vnp_BankCode'] = 'NCB';

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });

    var crypto = require('crypto');

    var hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);

    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

const signedParams = (vnp_Params) => {
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });

    var hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);

    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
        secureHash,
        signed,
        vnp_Params,
    };
}
const processVnpayIpn = async (params) => {
    const { secureHash, signed, vnp_Params } = signedParams(params);
    console.log(secureHash)
    console.log(signed)
    // Kiểm tra tính hợp lệ của mã hash
    if (secureHash !== signed) {
        return { rspCode: '97', message: 'Mã hash không hợp lệ' };
    }

    const rspCode = vnp_Params['vnp_ResponseCode'];
    const orderId = vnp_Params['vnp_OrderInfo'];
    let amount = parseFloat(vnp_Params['vnp_Amount']) / 100;

    let invoice = {};
    let message = '';

    // Kiểm tra các mã phản hồi từ VNPay để xử lý các trường hợp khác nhau
    switch (rspCode) {
        case '00': // Thanh toán thành công
            message = "success";
            invoice = await invoiceService.updateInvoiceStatus(orderId, message);
            break;

        case '24': // Giao dịch đã bị hủy
            message = "transaction canceled";
            invoice = await invoiceService.updateInvoiceStatus(orderId, "failed");
            break;

        case '01': 
            message = "transaction pending";
            invoice = await invoiceService.updateInvoiceStatus(orderId, "pending");
            break;

        default: // Các trường hợp khác không xác định
            message = 'Không xác định';
            invoice = await invoiceService.updateInvoiceStatus(orderId, "failed");
            break;
    }
    return { rspCode, message, invoice };
};


const sortObject = (obj) => {
    var sorted = {};
    var str = [];
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }

    str.sort();

    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }

    return sorted;
};

module.exports = {
    processPayment,
    processVnpayIpn,
}