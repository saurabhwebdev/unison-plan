import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId;

  // Basic Information
  name: string;
  companyName?: string;
  industry?: string;
  website?: string;

  // Primary Contact
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    position?: string;
  };

  // Additional Contacts
  additionalContacts: Array<{
    name: string;
    email: string;
    phone?: string;
    position?: string;
    isPrimary: boolean;
  }>;

  // Address Information
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  // Business Information
  status: "active" | "inactive" | "prospect" | "archived";
  clientType: "individual" | "small_business" | "enterprise" | "government";
  accountManager?: mongoose.Types.ObjectId;

  // Financial
  estimatedAnnualRevenue?: number;
  currency: string;

  // Relationship
  relationshipStartDate?: Date;
  lastContactDate?: Date;
  notes?: string;

  // Social & Communication
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  // Metadata
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Categorization
  tags: string[];
}

const ClientSchema = new Schema<IClient>(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Client name must be at least 2 characters"],
      maxlength: [200, "Client name must not exceed 200 characters"],
    },
    companyName: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Primary Contact
    primaryContact: {
      name: {
        type: String,
        required: [true, "Primary contact name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Primary contact email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        trim: true,
      },
    },

    // Additional Contacts
    additionalContacts: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        phone: {
          type: String,
          trim: true,
        },
        position: {
          type: String,
          trim: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Address Information
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
    },

    // Business Information
    status: {
      type: String,
      enum: ["active", "inactive", "prospect", "archived"],
      default: "active",
      required: true,
    },
    clientType: {
      type: String,
      enum: ["individual", "small_business", "enterprise", "government"],
      default: "small_business",
    },
    accountManager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Financial
    estimatedAnnualRevenue: {
      type: Number,
      min: [0, "Revenue cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },

    // Relationship
    relationshipStartDate: {
      type: Date,
    },
    lastContactDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [5000, "Notes must not exceed 5000 characters"],
    },

    // Social & Communication
    socialMedia: {
      linkedin: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
    },

    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Categorization
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
ClientSchema.index({ name: "text", companyName: "text" });
ClientSchema.index({ "primaryContact.email": 1 });
ClientSchema.index({ status: 1 });
ClientSchema.index({ clientType: 1 });
ClientSchema.index({ accountManager: 1 });
ClientSchema.index({ createdBy: 1 });
ClientSchema.index({ createdAt: -1 });

// Virtual for total projects
ClientSchema.virtual("projectCount", {
  ref: "Project",
  localField: "_id",
  foreignField: "client",
  count: true,
});

// Ensure virtuals are included in JSON
ClientSchema.set("toJSON", { virtuals: true });
ClientSchema.set("toObject", { virtuals: true });

const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;
