import { Module } from "@nestjs/common";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentSchema } from "./document.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Document",
        schema: DocumentSchema,
      },
    ]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
