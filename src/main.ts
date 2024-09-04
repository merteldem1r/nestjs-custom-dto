import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      disableErrorMessages: process.env.NODE_ENV === "production",
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (process.env.NODE_ENV === "development") {
    const config = new DocumentBuilder()
      .setTitle("API Documentation")
      .setDescription("API description")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);
  }

  await app.listen(3000);
}
bootstrap();
