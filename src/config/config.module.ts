import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptions } from './interfaces';

@Global()
@Module({})
export class ConfigModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'MODULE_OPTIONS_TOKEN',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
