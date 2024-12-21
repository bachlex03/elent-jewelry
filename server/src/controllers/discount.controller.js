// controllers/discount.controller.js
const discountService = require('../services/discount.service');

const createDiscount = async (req, res) => {
  try {
    const discountData = req.body;
    const newDiscount = await discountService.createDiscount(discountData);
    res.status(201).json({
      message: 'Discount created successfully',
      discount: newDiscount,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating discount',
      error: error.message,
    });
  }
};

const getAllDiscounts = async (req, res) => {
    try {
      const discounts = await discountService.getAllDiscounts();
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching discounts',
        error: error.message,
      });
    }
  };
  

  const updateDiscountById = async (req, res) => {
    try {
      const discountId = req.params.id;
      const updatedData = req.body;
      const updatedDiscount = await discountService.updateDiscountById(discountId, updatedData);
      
      if (!updatedDiscount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
  
      res.status(200).json({
        message: 'Discount updated successfully',
        discount: updatedDiscount,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error updating discount',
        error: error.message,
      });
    }
  };
  
  const deleteDiscount = async (req, res) => {
    try {
      const discountId = req.params.id;
      const deletedDiscount = await discountService.deleteDiscountById(discountId);
  
      if (!deletedDiscount) {
        return res.status(404).json({
          message: 'Discount not found',
        });
      }
  
      res.status(200).json({
        message: 'Discount deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting discount',
        error: error.message,
      });
    }
  };


  const getDiscountsByTotalPrice = async (req, res) => {
    try {
      const totalPrice = parseFloat(req.query.totalPrice);
      if (isNaN(totalPrice)) {
        return res.status(400).json({
          message: 'Invalid totalPrice',
        });
      }
  
      const discounts = await discountService.getDiscountsByTotalPrice(totalPrice);
  
      if (!discounts || discounts.length === 0) {
        return res.status(400).json({
          message: 'No discounts found for this total price',
        });
      }
  
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching discounts',
        error: error.message,
      });
    }
  };
  

  module.exports = {
    createDiscount,
    getAllDiscounts,
    updateDiscountById,
    deleteDiscount,
    getDiscountsByTotalPrice,
  };