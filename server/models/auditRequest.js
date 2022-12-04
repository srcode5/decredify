import mongoose from "mongoose";
import Loan from "./loan.js";
const { Schema } = mongoose;

const auditRequestSchema = new Schema(
  {
    userSentTo: {
      type: String,
      required: 'the user the audit request was sent to is required',
    },
    userToBeVerified: {
      type: String,
      required: 'the user the audit request is intended to verify is required',
    },
    loanToBeVerified: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: 'status of audit request is required'
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuditRequest", auditRequestSchema);
