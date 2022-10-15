const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    slug: String,
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

subCategorySchema.pre("^finds", function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
