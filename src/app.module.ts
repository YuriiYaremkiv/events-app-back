import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudService } from './cloud/cloud.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CitiesController } from './cities/cities.controller';
import { CitiesService } from './cities/cities.service';
import { CitiesModule } from './cities/cities.module';

@Module({
  controllers: [AppController, EventsController, CitiesController],
  providers: [AppService, CloudService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    EventsModule,
    AuthModule,
    UsersModule,
    CitiesModule,
  ],
})
export class AppModule {}
