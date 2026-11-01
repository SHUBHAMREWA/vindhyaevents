import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkVideo extends Document {
  title: string;
  category: string;
  videoUrl: string;
  videoType: "youtube" | "instagram" | "custom";
  thumbnailUrl?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WorkVideoSchema = new Schema<IWorkVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Videography",
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videoType: {
      type: String,
      enum: ["youtube", "instagram", "custom"],
      default: "youtube",
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
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

export const WorkVideo: Model<IWorkVideo> =
  mongoose.models.WorkVideo ||
  mongoose.model<IWorkVideo>("WorkVideo", WorkVideoSchema);

export default WorkVideo;
