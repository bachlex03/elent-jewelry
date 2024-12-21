const User = require("../models/user.model");
const Invoice = require("../models/invoice.model");
const Product = require("../models/product.model");
const Discount = require("../models/discount.model");
const Category = require("../models/category.model");
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate({
            path: "user_profile", // Populate profile dựa trên ObjectId trong userProfile
            model: "Profile",
            populate: {
                path: "profile_addresses", // Tiếp tục populate địa chỉ trong Profile
                model: "Address", // Liên kết đến model Address
            },
        });
        const formattedUsers = users.map((user) => {
            return {
                email: user.email,
                fullName:
                    user.user_profile.lastName +
                    " " +
                    user.user_profile.firstName,
                phone: user.user_profile.phoneNumber,
                verified:
                    user.verified + "" === "true"
                        ? "Đang hoạt động"
                        : "Chưa kích hoạt",
                createdAt: user.createdAt,
            };
        });
        res.status(200).json({ users: formattedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
    }
};
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: "products.product", // Populate product trong mảng products
                model: "Product", // Đảm bảo rằng bạn đang populate từ model 'Product'
            })
            .populate({
                path: "user", // Populate user
                model: "User",
                populate: {
                    path: "user_profile", // Populate profile của user
                    model: "Profile",
                },
            });
        const formatted = invoices.map((invoice) => {
            return {
                ...invoice._doc,
                orderCode: invoice.orderCode,
                username:
                    invoice.user.user_profile.lastName +
                    " " +
                    invoice.user.user_profile.firstName,
                userEmail: invoice.user.email,
                status:
                    invoice.status === "success"
                        ? "Thành công"
                        : invoice.status === "pending"
                          ? "Đang chờ"
                          : "Hủy đơn",
                amountToPay: invoice.amountToPay,
                paymentMethod: invoice.paymentMethod,
                createdAt: invoice.createdAt,
                products: invoice.products.map((p) => {
                    return p.product !== null
                        ? {
                              _id: p.product._id,
                              product_code: p.product.product_code,
                              product_name: p.product.product_name,
                              product_sale_price: p.product.product_sale_price,
                              quantity: p.quantity,
                              total_price:
                                  p.quantity * p.product.product_sale_price,
                          }
                        : null;
                }),
            };
        });

        console.log(formatted);

        // Tính tổng amountToPay
        const totalRevenue = invoices.reduce(
            (sum, invoice) => sum + invoice.amountToPay,
            0
        );

        res.status(200).json({
            invoices: formatted,
            totalRevenue,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin hóa đơn" });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .select(
                "product_code product_name product_price product_sale_price product_category product_isAvailable product_short_description createdAt"
            )
            .populate({
                path: "product_details",
                populate: {
                    path: "product_images",
                    select: "secure_url public_id asset_id",
                    model: "Image",
                },
            })
            .populate("product_category", "category_name");
        const formatted = products.map((p) => {
            return {
                ...p._doc,
                category: p.product_category
                    ? p.product_category.category_name
                    : null,
            };
        });

        res.status(200).json({ products: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm" });
    }
};
const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        const formatted = discounts.map((p) => {
            return {
                ...p._doc,
                discountType:
                    p.discountType === "percent" ? "Phần trăm" : "VNĐ",
            };
        });
        console.log(formatted);
        res.status(200).json({ discounts: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin mã giảm giá" });
    }
};
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().select(
            "category_name category_slug category_type category_parentId"
        );

        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin danh mục" });
    }
};

module.exports = {
    getAllUsers,
    getAllInvoices,
    getAllProducts,
    getAllDiscounts,
    getAllCategories,
};
