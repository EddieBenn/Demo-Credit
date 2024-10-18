import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LocationCounterModule } from './location-counter/location-counter.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    LocationCounterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
