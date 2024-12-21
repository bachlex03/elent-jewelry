// services/discount.service.js
const DiscountCode = require('../models/discount.model');

const createDiscount = async (discountData) => {
  try {
    const newDiscount = new DiscountCode(discountData);
    await newDiscount.save();
    return newDiscount;
  } catch (error) {
    throw new Error('Error creating discount');
  }
};

const getAllDiscounts = async () => {
    try {
      const discounts = await DiscountCode.find();
      return discounts;
    } catch (error) {
      throw new Error('Unable to fetch discounts');
    }
  };
  

  const updateDiscountById = async (id, updatedData) => {
    try {
      const updatedDiscount = await DiscountCode.findByIdAndUpdate(id, updatedData, { new: true });
      return updatedDiscount;
    } catch (error) {
      throw new Error('Unable to update discount');
    }
  };


const deleteDiscountById = async (id) => {
    try {
      const deletedDiscount = await DiscountCode.findByIdAndDelete(id);
      return deletedDiscount;
    } catch (error) {
      throw new Error('Error deleting discount');
    }
  };
  
  const getDiscountsByTotalPrice = async (totalPrice) => {
    try {
      // Tìm tất cả các mã giảm giá có điều kiện nhỏ hơn hoặc bằng tổng giá tiền
      const discounts = await DiscountCode.find({ condition: { $lte: totalPrice } });
      return discounts;
    } catch (error) {
      throw new Error('Error fetching discounts by total price');
    }
  };

  module.exports = {
    createDiscount,
    getAllDiscounts,
    updateDiscountById,
    deleteDiscountById,
    getDiscountsByTotalPrice
  };