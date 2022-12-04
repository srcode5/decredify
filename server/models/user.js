import mongoose from 'mongoose';
import Loan from "./loan.js";
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
      type: String,
      trim: true,
      required: 'Email is required',
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    location: {
        type: String,
    },
    loanHistory: {
      type: [String],
      default: [],
    },

    
}, { timestamps: true});



export default mongoose.model('User', userSchema);