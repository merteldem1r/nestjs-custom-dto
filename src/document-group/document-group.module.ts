import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentGroupController } from "./document-group.controller";
import { DocumentGroupSchema } from "./document-group.schema";
import { DocumentGroupService } from "./document-group.service";
import { DocumentSchema } from "src/document/document.schema";
import { DocumentModule } from "src/document/document.module";
import { DocumentExistsOrNewConstraint } from "src/validators/document-exists-new.validator";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "DocumentGroup", schema: DocumentGroupSchema },
      { name: "Document", schema: DocumentSchema },
    ]),
    DocumentModule,
  ],
  providers: [DocumentGroupService, DocumentExistsOrNewConstraint],
  controllers: [DocumentGroupController],
})
export class DocumentGroupModule {}
