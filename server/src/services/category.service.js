const Category = require('../models/category.model'); // Đảm bảo import đúng đường dẫn

// Service để tạo danh mục
const create = async (categoryData) => {
  const { category_slug } = categoryData;
  // Kiểm tra xem slug có tồn tại không
  const existingCategory = await Category.findOne({ category_slug });
  // Nếu slug đã tồn tại, đặt parentId
  if (existingCategory) {
    categoryData.category_parentId = existingCategory._id; // Nếu tồn tại, đặt là con
    categoryData.category_slug = categoryData.category_name;
  } else {
    categoryData.category_parentId = null; // Nếu không, đó là danh mục cha
  }
  // Tạo mới danh mục
  const newCategory = new Category(categoryData);

  // Lưu danh mục vào database
  return await newCategory.save();
};

// Lấy tất cả các danh mục cha
const getParentCategories = async () => {
    try {
      // Tìm tất cả danh mục có category_parentId = null (danh mục cha)
      return await Category.find({ category_parentId: null });
    } catch (error) {
      throw new Error('Lỗi khi lấy danh mục cha: ' + error.message);
    }
  }
  // Lấy các danh mục con theo ID cha
const getChildCategoriesByParentId = async (parentId) => {
    try {
      // Tìm tất cả danh mục có category_parentId là ID của danh mục cha
      return await Category.find({ category_parentId: parentId });
    } catch (error) {
     
      throw new Error('Lỗi khi lấy danh mục con: ' + error.message);
    }
  };
  const updateCategory = async (id, categoryData) => {
    try {
      const { category_slug, category_name, category_type } = categoryData;
  
      // Tìm danh mục hiện tại dựa trên ID
      const currentCategory = await Category.findById(id);
      if (!currentCategory) {
        throw new Error('Không tìm thấy danh mục để cập nhật');
      }
      // Kiểm tra nếu category_parentId của danh mục hiện tại là null
      if (currentCategory.category_parentId === null) {
        categoryData.category_slug = category_name;
        // Cập nhật bình thường nếu không có cha
        const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
        if (!updatedCategory) {
          throw new Error('Không tìm thấy danh mục để cập nhật');
        }
        return updatedCategory;
      }
      // Nếu category_parentId không phải null, kiểm tra slug của danh mục mới
      if (category_slug) {
        const parentCategory = await Category.findOne({
          category_parentId: null,  // Tìm danh mục cha (không có parent)
          category_slug: category_slug,  // Trùng slug với slug mới
        });
  
        // Nếu tìm thấy danh mục cha với slug trùng, gán parentId mới
        if (parentCategory) {
          categoryData.category_parentId = parentCategory._id;
        } else {
          // Nếu không tìm thấy danh mục cha trùng slug, giữ nguyên parentId hiện tại
          categoryData.category_parentId = currentCategory.category_parentId;
        }
      }
      categoryData.category_slug = category_name;
      // Cập nhật các trường khác sau khi xử lý parentId
      const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
      if (!updatedCategory) {
        throw new Error('Không tìm thấy danh mục để cập nhật');
      }
  
      return updatedCategory;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật danh mục: ' + error.message);
    }
  };
  
  const deleteCategory = async (id) => {
    try {
      // Tìm danh mục dựa trên ID
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục để xóa');
      }
  
      // Nếu danh mục có parentId (là danh mục con), chỉ xóa danh mục đó
      if (category.category_parentId) {
        await Category.findByIdAndDelete(id);
      } else {
        // Nếu không có parentId (là danh mục cha), xóa tất cả các danh mục con và chính nó
        await Category.deleteMany({ 
          $or: [{ _id: id }, { category_parentId: id }] 
        });
      }
      return true;
    } catch (error) {
      throw new Error('Lỗi khi xóa danh mục: ' + error.message);
    }
  };
module.exports = { create,getParentCategories ,getChildCategoriesByParentId,updateCategory,deleteCategory};
