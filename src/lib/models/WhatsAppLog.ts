import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWhatsAppLog extends Document {
  recipientPhone: string;
  recipientName: string;
  customerId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  messageType: "Custom" | "Booking-Confirmation" | "Payment-Reminder" | "Greeting" | "Event-Update" | "Vendor-Roster";
  channel: "Meta-Cloud-API" | "WhatsApp-Web-Direct";
  messageText: string;
  status: "Sent" | "Delivered" | "Read" | "Failed";
  metaMessageId?: string;
  errorReason?: string;
  sentByAdminName: string;
  sentAt: Date;
}

const WhatsAppLogSchema = new Schema<IWhatsAppLog>(
  {
    recipientPhone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      default: "Customer",
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    messageType: {
      type: String,
      enum: [
        "Custom",
        "Booking-Confirmation",
        "Payment-Reminder",
        "Greeting",
        "Event-Update",
        "Vendor-Roster",
      ],
      default: "Custom",
      index: true,
    },
    channel: {
      type: String,
      enum: ["Meta-Cloud-API", "WhatsApp-Web-Direct"],
      default: "Meta-Cloud-API",
      index: true,
    },
    messageText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Sent", "Delivered", "Read", "Failed"],
      default: "Sent",
      index: true,
    },
    metaMessageId: {
      type: String,
      default: "",
    },
    errorReason: {
      type: String,
      default: "",
    },
    sentByAdminName: {
      type: String,
      default: "Admin",
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

WhatsAppLogSchema.index({ recipientPhone: 1, sentAt: -1 });

export const WhatsAppLog: Model<IWhatsAppLog> =
  mongoose.models.WhatsAppLog || mongoose.model<IWhatsAppLog>("WhatsAppLog", WhatsAppLogSchema);
export default WhatsAppLog;
