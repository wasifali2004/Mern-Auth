import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    verifyOTP: {
        type: String,
        default: ''
    },
    verifyOTPExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOTP: {
        type: String,
        default: ''
    },
    resetOTPExpireAt: {
        type: Number,
        default: 0
    }
    

});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

 