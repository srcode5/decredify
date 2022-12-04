import mongoose from 'mongoose';
const {Schema} = mongoose;

const tokenSchema = new Schema({
    ownerWalletAddress: {
        type: String,
    },
    name: {
        type: String,
    },
    symbol: {
        type: String,
    },
    status: {
        type: Boolean,
    },
    totalSupply: {
        type: Number,
    },
    issued: {
        type: String,
    },
}, { timestamps: true});



export default mongoose.model('Token', tokenSchema);