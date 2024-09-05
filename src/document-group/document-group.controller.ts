import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateDocumentGroupDTO } from "./dto/dto";
import { DocumentGroupService } from "./document-group.service";

@Controller("api/v1/document-group")
export class DocumentGroupController {
  constructor(private readonly _DocumentGroupService: DocumentGroupService) {}

  @ApiOperation({ summary: "Get All Document Groups" })
  @Get()
  async getAllDocumentGroups() {
    return await this._DocumentGroupService.getAllDocumentGroups();
  }

  @ApiOperation({ summary: "Create a Document Group" })
  @Post()
  async createDocumentGroup(@Body() data: CreateDocumentGroupDTO) {
    return await this._DocumentGroupService.createDocumentGroup(data);
  }
}
