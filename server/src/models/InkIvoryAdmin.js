import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const inkIvoryAdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
});

inkIvoryAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const InkIvoryAdmin = mongoose.model("InkIvoryAdmin", inkIvoryAdminSchema);
export default InkIvoryAdmin;
