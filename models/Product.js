const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    price: { type: Number, required: true },
    priceDiscount: Number,
    ratingsAverage: { type: Number, default: 0 },
    ratingsQuantity: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quantity: { type: Number, required: true },
    coverImage: String,
    images: [String],
    slug: String,
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
