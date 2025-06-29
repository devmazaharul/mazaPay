const { Schema, model, models } = require("mongoose");

const accountSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "DISABLED"],
      default: "PENDING",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    pin: {
      type: String,
      required: true,
      minlength: [5, "Pin must be at least 5 digits"],
      maxlength: [5, "Pin must be at most 5 digits"],
      default: "12345",
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verifiedAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    apiKeyLimit: {
      type: Number,
      default: 3, 
    },
  },
  { timestamps: true }
);

const AccountModel = models.Account || model("Account", accountSchema);



module.exports = {
  AccountModel,
};