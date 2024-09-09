import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentGroup } from "./document-group.schema";
import mongoose, { Model } from "mongoose";
import { Document } from "../document/document.schema";
import { CreateDocumentGroupDTO } from "./dto/dto";

@Injectable()
export class DocumentGroupService {
  constructor(
    @InjectModel("DocumentGroup")
    private readonly DocumentGroupModel: Model<DocumentGroup>,
    @InjectModel("Document") private readonly DocumentModel: Model<Document>,
  ) {}

  async getAllDocumentGroups(pageIndex: number = 1, pageSize: number = 1) {
    const documentsGroupAggr = await this.DocumentGroupModel.aggregate([
      {
        $facet: {
          documentGroups: [
            { $match: {} },
            { $skip: Number(pageIndex - 1) * Number(pageSize) },
            { $limit: Number(pageSize) },
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: "documents",
                let: { documentsArr: "$documents" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$documentsArr"] } } },
                  { $project: { _id: 1, title: 1, content: 1, author: 1 } },
                ],
                as: "documents",
              },
            },
          ],
          data: [{ $match: {} }, { $count: "total" }],
        },
      },
    ]);

    return {
      total: documentsGroupAggr[0].data[0]?.total || 0,
      documentGroups: documentsGroupAggr[0].documentGroups,
    };
  }

  async createDocumentGroup(data: CreateDocumentGroupDTO) {
    const { documents } = data;

    const objectIds: mongoose.Types.ObjectId[] = [];
    const newDocumentObjects: object[] = [];

    for (const document of documents) {
      if (
        mongoose.Types.ObjectId.isValid(document as mongoose.Types.ObjectId)
      ) {
        objectIds.push(
          new mongoose.Types.ObjectId(document as mongoose.Types.ObjectId),
        );
      } else if (typeof document === "object") {
        newDocumentObjects.push(document);
      } else {
        return false;
      }
    }

    let createdNewDocuments = await this.DocumentModel.create();

    if (newDocumentObjects.length > 0) {
      createdNewDocuments = await this.DocumentModel.create(newDocumentObjects);
    }

    const newDocumentIds = createdNewDocuments.map((doc) => doc._id);

    const documentGroup = await this.DocumentGroupModel.create({
      ...data,
      documents: [...objectIds, ...newDocumentIds],
    });

    return documentGroup;
  }
}
