const User = require('../models/user.model');
const Product = require('../models/product.model');
const Discount = require('../models/discount.model');
const Invoice = require('../models/invoice.model');
const Address = require('../models/address.model');
const vnpayService = require('../vnpay/vnpay.service')

const confirmInforPayment = async (email, items, discount_id) => {
    try {
        // Kiểm tra tính hợp lệ của token người dùng
        const user = await User.findOne({ email }).populate({
            path: 'user_profile',
            model: 'Profile',
            populate: {
                path: 'profile_addresses',
                model: 'Address'
            }
        })
        if (!user) {
            throw new Error('Người dùng không hợp lệ');
        }

        let totalAmountBeforeDiscount = 0; // Tổng số tiền chưa giảm
        let discountApplied = 0; // Số tiền giảm giá
        const productDetails = []; // Lưu thông tin sản phẩm chi tiết

        // Lấy thông tin từng sản phẩm và tính tổng số tiền
        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
            }
            // Kiểm tra và sử dụng giá bán hoặc giá gốc
            const price = product.product_sale_price || product.product_price;
            // Tính số tiền cho từng sản phẩm và tổng cộng
            const itemTotal = price * item.quantity;
            totalAmountBeforeDiscount += itemTotal;

            // Thêm thông tin sản phẩm vào danh sách
            productDetails.push({
                product_id: product._id,
                name: product.product_name,
                price,
                quantity: item.quantity,
                itemTotal, // Tổng tiền cho sản phẩm này
            });
        }

        // Áp dụng mã giảm giá nếu có
        let discountDetails = null;
        if (discount_id) {
            const discount = await Discount.findById(discount_id);
            if (discount) {
                // Kiểm tra loại giảm giá
                if (discount.discountType === 'percent') {
                    discountApplied = (totalAmountBeforeDiscount * discount.discountAmount) / 100;
                } else if (discount.discountType === 'fixed') {
                    discountApplied = discount.discountAmount;
                }

                discountDetails = {
                    discount_id: discount._id,
                    discount_name: discount.name,
                    discount_amount: discount.discountAmount,
                    discount_type: discount.discountType,
                    start_date: discount.startDate,
                    end_date: discount.endDate,
                };
            }
        }

        // Tính tổng tiền sau khi giảm giá, đảm bảo không âm
        const totalAmountAfterDiscount = Math.max(totalAmountBeforeDiscount - discountApplied, 0);

        return {
            user,
            products: productDetails,
            discount: discountDetails,
            totalAmountBeforeDiscount, // Tổng tiền trước khi giảm giá
            discountApplied, // Số tiền giảm giá
            totalAmountAfterDiscount, // Tổng tiền sau khi giảm giá
        };
    } catch (error) {
        console.error('Lỗi xử lý trong lúc xác nhận thanh toán:', error.message);
        throw error; // Ném lỗi ra ngoài để controller xử lý
    }
};

const processPayment = async (paymentData) => {
    try {
        const {
            email,
            address, // Đây là ID của địa chỉ đã chọn
            otherAddress,
            paymentMethod,
            items,
            discount_id,
        } = paymentData;

        // 1. Kiểm tra người dùng bằng email
        const user = await User.findOne({ email }).populate({
            path: 'user_profile',
            model: 'Profile',
            populate: {
                path: 'profile_addresses',
                model: 'Address'
            }
        });
        if (!user) throw new Error("Người dùng không tồn tại");

        // 2. Kiểm tra địa chỉ từ ID `address` nếu có giá trị
        let selectedAddress;
        if (address) {
            selectedAddress = await Address.findById(address);
            if (!selectedAddress) throw new Error("Địa chỉ không tồn tại");
        }

        // 3. Thêm `otherAddress` vào danh sách địa chỉ của người dùng nếu `otherAddress` có giá trị
        if (otherAddress) {
            const newAddress = new Address({
                country: otherAddress.country ,
                city: otherAddress.city ,
                district: otherAddress.district ,
                addressLine: otherAddress.addressLine 
            });
            await newAddress.save();

            // Thêm `newAddress` vào `profile_addresses` của người dùng
            user.user_profile.profile_addresses.push(newAddress._id);
            await user.user_profile.save();
            selectedAddress = newAddress;
        }

        // 4. Lấy thông tin từng sản phẩm và tính tổng số tiền
        let totalAmountBeforeDiscount = 0; // Tổng số tiền chưa giảm
        const productDetails = []; // Lưu thông tin sản phẩm chi tiết

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);

            // Kiểm tra và sử dụng giá bán hoặc giá gốc
            const price = product.product_sale_price || product.product_price;

            // Tính số tiền cho từng sản phẩm và tổng cộng
            const itemTotal = price * item.quantity;
            totalAmountBeforeDiscount += itemTotal;

            // Thêm thông tin sản phẩm vào danh sách
            productDetails.push({
                product_id: product._id,
                name: product.product_name,
                price,
                quantity: item.quantity,
                itemTotal, // Tổng tiền cho sản phẩm này
            });
        }

        // 5. Kiểm tra và áp dụng mã giảm giá nếu có `discount_id`
        let discountApplied = 0; // Số tiền giảm giá
        let discountDetails = null;

        if (discount_id !== null) {
            const discount = await Discount.findById(discount_id);  
            if (discount) {
                // Kiểm tra loại giảm giá
                if (discount.discountType === 'percent') {
                    discountApplied = (totalAmountBeforeDiscount * discount.discountAmount) / 100;
                } else if (discount.discountType === 'fixed') {
                    discountApplied = discount.discountAmount;
                }

                discountDetails = {
                    discount_id: discount._id,
                    discount_name: discount.name,
                    discount_amount: discount.discountAmount,
                    discount_type: discount.discountType,
                    start_date: discount.startDate,
                    end_date: discount.endDate,
                };
            }
        }
        // 6. Tính tổng tiền sau khi giảm giá, đảm bảo không âm
        const totalAmountAfterDiscount = Math.max(totalAmountBeforeDiscount - discountApplied, 0);

        // Tạo hóa đơn trước khi kiểm tra phương thức thanh toán
        const newInvoice = new Invoice({
            user: user._id,
            products: items.map(item => ({
                product: item.product_id,
                quantity: item.quantity,
            })),
            discountCode: discount_id || null,
            totalAmount: totalAmountBeforeDiscount,
            discountAmount: discountApplied,
            amountToPay: totalAmountAfterDiscount,
            paymentMethod: paymentMethod,
            status: "pending", // Set initial status as "pending"
            orderCode: generateOrderCode(), 
            purchaseDate: new Date() // Set purchase date
        });

        await newInvoice.save();
        // 7. Kiểm tra phương thức thanh toán
        if (paymentMethod === "VNPAY") {
            // Gọi hàm xử lý thanh toán VNPay
            const vnPayResult = await handleVnPayPayment(newInvoice);// id invoice 
            return vnPayResult; // Trả về kết quả từ VNPay
        }
        if (paymentMethod === "COD"){
            return newInvoice;
        }
      
    } catch (error) {
        console.log("Lỗi trong processPayment:", error);
        throw new Error("Xử lý thanh toán thất bại");
    }
};
const handleVnPayPayment = async (newInvoice) => {
    try {
        // Thực hiện thanh toán VNPay
        const vnpayResponse = await vnpayService.processPayment(newInvoice);
        if (vnpayResponse) {
            return {
                vnpayResponse,
                invoice: newInvoice
            };
        } else {
            throw new Error(vnpayResponse.message || "Thanh toán VNPay không thành công");
        }
    } catch (error) {
        console.log("Lỗi trong handleVnPayPayment:", error);
        throw new Error("Xử lý thanh toán VNPay thất bại");
    }
};
const generateOrderCode = () => {
    const datePart = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 8); // YYYYMMDD
    const randomPart = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${datePart}${randomPart}`;
};

module.exports = {
    confirmInforPayment,
    processPayment,
};
