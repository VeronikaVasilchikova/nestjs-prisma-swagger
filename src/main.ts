import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Auto-validation - to ensure all endpoints are protected from receiving incorrect data
  // {
  //   "statusCode": 400,
  //   "message": [
  //       "title must be a string"
  //   ],
  //   "error": "Bad Request"
  // }
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
    // disableErrorMessages: true,
  }));
  // whitelist - to filter out properties that should not be received by the method handler
  // forbidNonWhitelisted - stop the request from processing when non-whitelisted properties are present, and return an error
  // disableErrorMessages - disable detailed errors

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  // whithout above filter:
  // {
  //   "statusCode": 500,
  //   "message": "Internal server error"
  // }

  await app.listen(3000);
}
bootstrap();
