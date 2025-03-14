import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    imageUrl: { type: String, default: null }, // ✅ Make it optional
    logoID: { type: String, default: null } // ✅ Make it optional
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;