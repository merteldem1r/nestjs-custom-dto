import { Body, Controller, Get, Post } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { ApiOperation } from "@nestjs/swagger";
import { CreateDocumentDTO } from "./dto/dto";

@Controller("api/v1/document")
export class DocumentController {
  constructor(private readonly _DocumentService: DocumentService) {}

  @ApiOperation({ summary: "Get All Documents" })
  @Get()
  async getAllDocuments() {
    return await this._DocumentService.getDocuments();
  }

  @ApiOperation({ summary: "Create a Document" })
  @Post()
  async createDocument(@Body() data: CreateDocumentDTO) {
    return await this._DocumentService.createDocument(data);
  }
}
