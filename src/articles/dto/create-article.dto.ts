// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// These rules will be picked up by the ValidationPipe and applied automatically to your route handlers
// use classes instead of interfaces:
// 1. Classes are part of the JavaScript ES6 standard, and therefore they are preserved as real entities in the compiled JavaScript
// 2. since TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

// Validation pipe compares incoming request against the DTO
export class CreateArticleDto {
  @IsString()
  // @IsString({ message: "test message" })
  @IsNotEmpty()
  @ApiProperty({ description: 'Article title', required: true })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  body: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
