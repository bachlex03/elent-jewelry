const { model, Schema } = require("mongoose");

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    category_slug: {
      type: String,
      unique: true,
      index: true,
    },
    category_type: { // Phân biệt loại danh mục
      type: String,
      enum: ["material", "audience", "category", "style"],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Categories",
  }
);
module.exports = model("Category", categorySchema);
