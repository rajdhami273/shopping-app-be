const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    countryCode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    activeStatus: {
      type: {
        isActive: {
          type: Boolean,
          default: true,
        },
        inactiveReason: {
          type: String,
          default: "",
        },
        inactiveCode: {
          type: String,
          default: "",
        },
        inactiveDate: {
          type: Date,
          default: "",
        },
        activeDate: {
          type: Date,
          default: "",
        },
      },
      default: {
        isActive: false,
        inactiveReason: "User is not verified",
        inactiveCode: "USER_NOT_VERIFIED",
        inactiveDate: new Date(),
        activeDate: "",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform: function (_, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
