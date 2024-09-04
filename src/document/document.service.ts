import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateDocumentDTO } from "./dto/dto";

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel("Document") private readonly DocumentModel: Model<Document>,
  ) {}

  async getDocuments() {
    const documents = await this.DocumentModel.find({});
    const total = await this.DocumentModel.estimatedDocumentCount();

    return { total, documents };
  }

  async createDocument(data: CreateDocumentDTO) {
    const document = await this.DocumentModel.create(data);

    return document;
  }
}
