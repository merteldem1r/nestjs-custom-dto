import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Document {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    type: String,
    default: "No content",
  })
  content: string;

  @Prop({
    required: true,
    type: String,
  })
  author: String;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
