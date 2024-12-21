const  categoryService  = require('../services/category.service');

const createCategory = async (req, res) => {
  // Lấy thông tin từ body
  const { category_name, category_slug, category_type } = req.body;

  // Tạo đối tượng categoryData để truyền vào service
  const categoryData = {
    category_name,
    category_slug,
    category_type,
  };
  try {
    // Gọi service để thực hiện logic tạo danh mục
    const savedCategory = await categoryService.create(categoryData);

    // Trả về phản hồi thành công
    res.status(201).json({ message: 'Danh mục đã được tạo', savedCategory});
  } catch (error) {
    console.error(error);
    // Trả về phản hồi lỗi
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};
// Lấy tất cả các danh mục cha
const getParentCategories = async (req, res) => {
  try {
    // Gọi service để lấy danh mục cha
    const parentCategories = await categoryService.getParentCategories();

    // Trả về danh sách danh mục cha
    res.status(200).json(parentCategories);
  } catch (error) {
    console.error(error);
    // Xử lý lỗi máy chủ
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Lấy các danh mục con theo ID cha
const getChildCategoriesByParentId = async (req, res) => {
    const { parentId } = req.params;
    console.log(req.params)
    try {
      // Gọi service để lấy danh mục con theo ID cha
      const childCategories = await categoryService.getChildCategoriesByParentId(parentId);
      // Kiểm tra xem có danh mục con nào không
      if (childCategories.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục con' });
      }
      // Trả về danh sách danh mục con
      res.status(200).json(childCategories);
    } catch (error) {
      console.error(error);
      // Xử lý lỗi máy chủ
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  };
  const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = req.body;
  
      // Gọi service để cập nhật danh mục
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
  
      return res.status(200).json({
        message: 'Danh mục đã được cập nhật',
        category: updatedCategory,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi khi cập nhật danh mục: ' + error.message,
      });
    }
  };

  const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await categoryService.deleteCategory(id);
      if (result) {
        return res.status(200).json({ message: 'Danh mục đã được xóa thành công' });
      } else {
        return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: error.message });
    }
  };

module.exports = { createCategory,getParentCategories,getChildCategoriesByParentId ,updateCategory,deleteCategory,};
