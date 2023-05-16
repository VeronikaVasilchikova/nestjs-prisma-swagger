import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  Req,
  Res,
  HttpStatus,
  UseFilters
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';

// @Controller is a required decorator
// route path prefix is optional
// to create controller using CLI run `nest g controller [name]`
@Controller('articles')
@ApiTags('articles') // swagger decorator
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {} // DI

  @Post() // handler for a specific endpoint for HTTP requests
  // @UseFilters(PrismaClientExceptionFilter) 
  @ApiCreatedResponse({ type: ArticleEntity }) // swagger decorator
  // @HttpCode(204) // No Content
  async create( // method name is completely arbitrary
    @Res({ passthrough: true }) response, // losing compatibility with Nest features that depend on Nest standard response handling
    @Body() createArticleDto: CreateArticleDto
  ) { 
    const newArticle = new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
    // default status code is 201 (Created)
    return newArticle; 

    // return response.status(HttpStatus.CREATED).json({
    //   message: 'Article has been created successfully',
    //   article: newArticle
    // });
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
    // default status code is 200 (Ok)
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(
    @Req() request: Request,
    // NestJS parses the id parameter as a string from the URL path
    @Param('id', ParseIntPipe) id: number,
  ) {
    // console.log(request);
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`); // built-in exception
    }
    // whithout the above condition:
    // {
    //   "statusCode": 500,
    //   "message": "Internal server error"
    // }
    return new ArticleEntity(article);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
