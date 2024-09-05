import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentGroup } from "./document-group.schema";
import { Model } from "mongoose";
import { CreateDocumentGroupDTO } from "./dto/dto";

@Injectable()
export class DocumentGroupService {
  constructor(
    @InjectModel("DocumentGroup")
    private readonly DocumentGroupModel: Model<DocumentGroup>,
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
      sites: documentsGroupAggr[0].documentsGroup,
    };
  }

  async createDocumentGroup(data: CreateDocumentGroupDTO) {
    return "foo";
  }
}
