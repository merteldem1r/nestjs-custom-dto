import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
})
export class DocumentGroup {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    ref: "Document",
    type: [mongoose.Types.ObjectId],
    default: [],
  })
  documents: [mongoose.Types.ObjectId];

  @Prop({
    type: Number,
  })
  documentCount: number;
}

export const DocumentGroupSchema = SchemaFactory.createForClass(DocumentGroup);

DocumentGroupSchema.pre("save", function (next) {
  this.documentCount = this.documents.length;
  next();
});
