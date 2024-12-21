const { model, Schema } = require("mongoose");

const reviewSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review_description: {
      type: String,
      default: "",
    },
    review_images: 
    {
      type: [Schema.Types.ObjectId],  // Sử dụng ObjectId để tham chiếu đến mô hình Image
      ref: "Image",                 // Tên mô hình là "Image"
    },
    
  },
{
  timestamps: true,
    collection: "Reviews",
  }
);

module.exports = model("Review", reviewSchema);
