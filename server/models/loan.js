import mongoose from "mongoose";
import Loan from "./loan.js";
const { Schema } = mongoose;

const loanSchema = new Schema(
  {
    loanId: {
      type: String,
      required: 'Loan ID is required',
      unique: true,
    },
    pool: {
      type: String,
    },
    receiver: {
      type: String,
      required: 'Wallet is required',
    },
    auditors: {
      type: [String],
      default: [],
    },
    interestRate: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
