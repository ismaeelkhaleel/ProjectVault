import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    course: {
      type: String,
      enum: ["MCA", "MSC (CYBER SECURITY)", "BSC (CS)", ""],
      default: "",
      uppercase: true,
    },
    enrollNumber: {
      type: String,
      default: "",
      match: /^[A-Z]{2}\d{4}$/,
      uppercase: true,
    },
    facNumber: {
      type: String,
      default: "",
      match: /^\d{2}CAMSA\d{3}$/,
      uppercase: true,
    },
    idCard: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    verifRequest: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
