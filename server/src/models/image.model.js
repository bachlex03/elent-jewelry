const { model, Schema } = require("mongoose");

const imageSchema = new Schema({
  asset_id: { 
    type: String, 
    default: "" 
  },
  public_id: { 
    type: String, 
    default: "" 
  },
  format: { 
    type: String, 
    default: "" 
  },
  resource_type: { 
    type: String, 
    default: "" 
  },
  secure_url: { 
    type: String, 
    default: "" 
  },
  original_filename: { 
    type: String, 
    default: "" 
  },
}, {
  timestamps: true,
  collection: "Images"
});

module.exports = model("Image", imageSchema);
