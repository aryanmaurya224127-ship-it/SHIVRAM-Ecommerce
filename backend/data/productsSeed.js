import Product from "../models/productModel.js";

const productsSeed = [
  // Products will be added here
];

export const seedProducts = async () => {
  try {
    await Product.deleteMany();

    await Product.insertMany(productsSeed);

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Product seeding failed:", error.message);
  }
};

export default productsSeed;