const { model, Schema } = require("mongoose");

const productSchema = new Schema(
  {
    product_code: { 
      type: String, 
      required: true,
      unique: true,
    },
    product_name: { 
      type: String, 
      required: true 
    },
    product_price: { 
      type: Number, 
      required: true 
    },
    product_sale_price: { 
      type: Number, 
      required: false 
    },
    product_category: {
      type:Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    product_details: {
      type: Schema.Types.ObjectId,
      ref: "ProductDetail",
      required: true,
    },
    product_isAvailable: { 
      type: Boolean, 
      default: true 
    },
    product_short_description: { 
      type: String, 
      default: "" 
    },
  },
  {
    timestamps: true,
    collection: "Products",
  }
);

module.exports = model("Product", productSchema);
