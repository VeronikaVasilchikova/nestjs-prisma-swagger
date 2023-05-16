import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConfigModule } from './config/config.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

@Module({
  imports: [
    // ConfigModule.register({ folder: './config' }),
    ArticlesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Thanks to that, we could inject additional dependencies into our filter.
    // {
    //   provide: 'APP_FILTER',
    //   useClass: PrismaClientExceptionFilter,
    // },
  ],
})
export class AppModule {}
