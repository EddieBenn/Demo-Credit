import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ObjectionModule } from 'nestjs-objection';
import { Model } from 'objection';
import knexConfig from '../prod-knexconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig],
    }),
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('knex'),
    }),
    ObjectionModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get('knex');
        return {
          Model: Model,
          config: knexConfig.config,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
