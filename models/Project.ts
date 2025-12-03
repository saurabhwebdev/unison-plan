import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  projectCode: string;

  // Client Information
  clientName: string;
  clientContact: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };

  // Project Stage & Status
  stage:
    | "lead"
    | "pre_bid"
    | "bid_submitted"
    | "negotiation"
    | "won"
    | "in_progress"
    | "on_hold"
    | "completed"
    | "lost"
    | "cancelled";
  status: "active" | "archived";

  // Financial Information
  estimatedValue?: number;
  actualValue?: number;
  currency: string;
  budget?: number;
  actualSpend?: number;

  // Timeline
  leadDate?: Date;
  bidDeadline?: Date;
  bidSubmittedDate?: Date;
  expectedDecisionDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number;
  actualCompletionDate?: Date;

  // Team & Ownership
  businessDevelopmentLead?: mongoose.Types.ObjectId;
  projectManager?: mongoose.Types.ObjectId;
  teamMembers: Array<{
    user: mongoose.Types.ObjectId;
    role: string;
    assignedDate: Date;
  }>;

  // Bid Information
  bidProbability?: number;
  competitors?: string[];
  winLossReason?: string;

  // Progress Tracking
  progressPercentage: number;
  priority: "low" | "medium" | "high" | "critical";

  // Metadata
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  archivedBy?: mongoose.Types.ObjectId;

  // Categorization
  tags: string[];
  category?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [3, "Project name must be at least 3 characters"],
      maxlength: [200, "Project name must not exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    projectCode: {
      type: String,
      required: [true, "Project code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Client Information
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientContact: {
      name: {
        type: String,
        required: [true, "Client contact name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Client contact email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
        type: String,
        trim: true,
      },
      company: {
        type: String,
        trim: true,
      },
    },

    // Project Stage & Status
    stage: {
      type: String,
      enum: [
        "lead",
        "pre_bid",
        "bid_submitted",
        "negotiation",
        "won",
        "in_progress",
        "on_hold",
        "completed",
        "lost",
        "cancelled",
      ],
      default: "lead",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      required: true,
    },

    // Financial Information
    estimatedValue: {
      type: Number,
      min: [0, "Estimated value cannot be negative"],
    },
    actualValue: {
      type: Number,
      min: [0, "Actual value cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    actualSpend: {
      type: Number,
      min: [0, "Actual spend cannot be negative"],
      default: 0,
    },

    // Timeline
    leadDate: {
      type: Date,
    },
    bidDeadline: {
      type: Date,
    },
    bidSubmittedDate: {
      type: Date,
    },
    expectedDecisionDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
      min: [0, "Duration cannot be negative"],
    },
    actualCompletionDate: {
      type: Date,
    },

    // Team & Ownership
    businessDevelopmentLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    projectManager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    teamMembers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        assignedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Bid Information
    bidProbability: {
      type: Number,
      min: [0, "Probability must be between 0 and 100"],
      max: [100, "Probability must be between 0 and 100"],
    },
    competitors: [
      {
        type: String,
        trim: true,
      },
    ],
    winLossReason: {
      type: String,
      trim: true,
    },

    // Progress Tracking
    progressPercentage: {
      type: Number,
      min: [0, "Progress must be between 0 and 100"],
      max: [100, "Progress must be between 0 and 100"],
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    archivedAt: {
      type: Date,
    },
    archivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for better query performance
ProjectSchema.index({ name: "text", description: "text" });
ProjectSchema.index({ projectCode: 1 });
ProjectSchema.index({ stage: 1, status: 1 });
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ projectManager: 1 });
ProjectSchema.index({ "teamMembers.user": 1 });
ProjectSchema.index({ createdAt: -1 });

// Generate unique project code before saving
ProjectSchema.pre("save", async function (next) {
  if (this.isNew && !this.projectCode) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Project.countDocuments();
    this.projectCode = `PRJ-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Virtual for total team size
ProjectSchema.virtual("teamSize").get(function () {
  return this.teamMembers?.length || 0;
});

// Ensure virtuals are included in JSON
ProjectSchema.set("toJSON", { virtuals: true });
ProjectSchema.set("toObject", { virtuals: true });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
