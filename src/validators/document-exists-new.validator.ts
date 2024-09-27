import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import {
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationError,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import mongoose, { Model, mongo } from "mongoose";
import { CreateDocumentDTO } from "src/document/dto/dto";
import { Document } from "../document/document.schema";

export function DocumentExistsOrNew(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "DocumentExistsOrNew",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: DocumentExistsOrNewConstraint,
    });
  };
}

@ValidatorConstraint({ name: "DocumentExistsOrNew", async: true })
@Injectable()
export class DocumentExistsOrNewConstraint
  implements ValidatorConstraintInterface
{
  private validationErrors: ValidationError[] = [];

  constructor(
    @InjectModel("Document") private readonly DocumentModel: Model<Document>,
  ) {}

  async validate(
    data: Array<mongoose.Types.ObjectId | object>,
    args: ValidationArguments,
  ): Promise<boolean> {
    try {
      const objectIds: mongoose.Types.ObjectId[] = [];
      const newDocumentObjects: object[] = [];

      for (const item of data) {
        if (typeof item === "string" && mongoose.Types.ObjectId.isValid(item)) {
          objectIds.push(item as mongoose.Types.ObjectId);
        } else if (typeof item === "object") {
          newDocumentObjects.push(item);
        } else {
          return false;
        }
      }

      if (objectIds.length > 0) {
        const existingDocuments = await this.DocumentModel.countDocuments({
          _id: { $in: objectIds },
        });

        if (existingDocuments !== objectIds.length) {
          return false;
        }
      }

      if (newDocumentObjects.length > 0) {
        for (const docObj of newDocumentObjects) {
          const dtoObject = plainToInstance(CreateDocumentDTO, docObj);
          const dtoErrors = await validate(dtoObject);

          if (dtoErrors.length > 0) {
            this.validationErrors = dtoErrors;
            return false;
          }
        }
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    if (this.validationErrors.length === 0) {
      return "Invalid document(s) provided. Documents array must be either existing document MongodbId or new document object.";
    }

    const errorConstraints: string[] = [];

    for (const error of this.validationErrors) {
      if (error.constraints) {
        errorConstraints.push(...Object.values(error.constraints));
      }

      if (error.children) {
        error.children.forEach((childError) =>
          errorConstraints.push(
            ...Object.values(childError.children[0].constraints),
          ),
        );
      }
    }

    return errorConstraints.join(" || ");
  }
}
