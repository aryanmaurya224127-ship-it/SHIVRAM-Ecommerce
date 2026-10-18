
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../Models/User");

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      "Usage: node scripts/promoteAdmin.js your-email@example.com"
    );
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(
      "Account not found. Register this account first."
    );
  }

  user.role = "admin";
  await user.save();

  console.log(`Admin role assigned to ${user.email}`);
}

main()
  .catch((error) => {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
