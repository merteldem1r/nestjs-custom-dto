import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DocumentModule } from "./document/document.module";
import { ConfigModule } from "@nestjs/config";
import { DocumentGroupModule } from "./document-group/document-group.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    DocumentModule,
    DocumentGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
