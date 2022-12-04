import mongoose from 'mongoose';
import User from "./user.js";
const {Schema} = mongoose;

const poolSchema = new Schema({
    name: {
        type: String,
    },
    usdcYield: {
        type: Number,
    },
    dcfyYield: {
        type: Number,
    },
    balance: {
        type: Number,
    },
    loansOutstanding: {
        type: Number,
    },
    defaultRate: {
        type: Number,
    },
    overview: {
        type: String,
    },
    highlights: {
        type: [String],
        default: [],
    },
    tag: {
        type: String,
    }

    
}, { timestamps: true});



export default mongoose.model('Pool', poolSchema);