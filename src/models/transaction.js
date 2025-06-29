const { Schema, model, models } = require("mongoose");

const trxSchema = new Schema(
  {
      trxID: {
      type: String,
      required: true,
    },
    userID:{
          type:Schema.Types.ObjectId,
        ref:"Account"
    },
    relatedUserID:{
      type:Schema.Types.ObjectId,
      ref:"Account"
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required:true,
      enum:["credit","debit"]
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
      
    },
  },
  { timestamps: true }
);


const TransactionModel = models.Transaction || model("Transaction", trxSchema);

module.exports = {
  TransactionModel,
};
