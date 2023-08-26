const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wallet = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    credit_amount: { type: Number, required: true },
    credit_remarks: { type: String },
  },
  { timestamps: true }
);

const WalletModel = mongoose.model("wallet", Wallet);
module.exports = WalletModel;
