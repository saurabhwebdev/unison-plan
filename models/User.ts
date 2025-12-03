import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user" | "manager" | "project_manager" | "business_development";
  isVerified: boolean;
  isFirstLogin: boolean;
  invitedBy?: string;
  otp?: string;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailPreferences: {
    enabled: boolean;
    frequency: "instant" | "daily_digest" | "weekly_digest";
    projectCreated: boolean;
    projectAssigned: boolean;
    projectStatusChanged: boolean;
    projectDeadlineApproaching: boolean;
    projectCompleted: boolean;
    taskAssigned: boolean;
    taskDueSoon: boolean;
    taskOverdue: boolean;
    taskCompleted: boolean;
    taskStatusChanged: boolean;
    taskMentioned: boolean;
    clientAssigned: boolean;
    clientStatusChanged: boolean;
    budgetAlert: boolean;
    teamMemberAdded: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "manager", "project_manager", "business_development"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    invitedBy: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    emailPreferences: {
      type: {
        enabled: { type: Boolean, default: true },
        frequency: {
          type: String,
          enum: ["instant", "daily_digest", "weekly_digest"],
          default: "instant"
        },
        projectCreated: { type: Boolean, default: true },
        projectAssigned: { type: Boolean, default: true },
        projectStatusChanged: { type: Boolean, default: true },
        projectDeadlineApproaching: { type: Boolean, default: true },
        projectCompleted: { type: Boolean, default: true },
        taskAssigned: { type: Boolean, default: true },
        taskDueSoon: { type: Boolean, default: true },
        taskOverdue: { type: Boolean, default: true },
        taskCompleted: { type: Boolean, default: false },
        taskStatusChanged: { type: Boolean, default: false },
        taskMentioned: { type: Boolean, default: true },
        clientAssigned: { type: Boolean, default: true },
        clientStatusChanged: { type: Boolean, default: false },
        budgetAlert: { type: Boolean, default: true },
        teamMemberAdded: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
        monthlyReport: { type: Boolean, default: false },
      },
      default: () => ({
        enabled: true,
        frequency: "instant",
        projectCreated: true,
        projectAssigned: true,
        projectStatusChanged: true,
        projectDeadlineApproaching: true,
        projectCompleted: true,
        taskAssigned: true,
        taskDueSoon: true,
        taskOverdue: true,
        taskCompleted: false,
        taskStatusChanged: false,
        taskMentioned: true,
        clientAssigned: true,
        clientStatusChanged: false,
        budgetAlert: true,
        teamMemberAdded: true,
        weeklyDigest: false,
        monthlyReport: false,
      }),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// Clear cached model to ensure schema updates are applied
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
