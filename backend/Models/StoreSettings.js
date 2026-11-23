const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: "store" },
  coinRewardPercentage: { type: Number, required: true, min: 0, max: 20, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
