import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;

  // Task Details
  title: string;
  description?: string;
  taskNumber: string;

  // Status & Priority
  status:
    | "todo"
    | "in_progress"
    | "in_review"
    | "blocked"
    | "completed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "critical";

  // Assignment
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;

  // Timeline
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;

  // Relationships
  parentTask?: mongoose.Types.ObjectId;
  dependencies: mongoose.Types.ObjectId[];
  milestone?: mongoose.Types.ObjectId;

  // Progress
  progressPercentage: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Additional
  tags: string[];
}

const TaskSchema = new Schema<ITask>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },

    // Task Details
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters"],
      maxlength: [200, "Task title must not exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    taskNumber: {
      type: String,
      required: [true, "Task number is required"],
      trim: true,
      uppercase: true,
    },

    // Status & Priority
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "blocked", "completed", "cancelled"],
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      required: true,
    },

    // Assignment
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Timeline
    dueDate: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
      default: 0,
    },

    // Relationships
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    dependencies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    milestone: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },

    // Progress
    progressPercentage: {
      type: Number,
      min: [0, "Progress must be between 0 and 100"],
      max: [100, "Progress must be between 0 and 100"],
      default: 0,
    },

    // Additional
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ taskNumber: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

// Auto-update startedAt when status changes to in_progress
TaskSchema.pre("save", async function () {
  if (this.isModified("status")) {
    if (this.status === "in_progress" && !this.startedAt) {
      this.startedAt = new Date();
    }
    if (this.status === "completed" && !this.completedAt) {
      this.completedAt = new Date();
      this.progressPercentage = 100;
    }
  }
});

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
