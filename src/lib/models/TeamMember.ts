import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  experience?: string;
  image: {
    url: string;
    public_id?: string;
    alt?: string;
  };
  bio?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      default: "Since 2021",
      trim: true,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TeamMemberSchema.index({ order: 1, createdAt: -1 });

export const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
