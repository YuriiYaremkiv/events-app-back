import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { CitiesModule } from './cities/cities.module';
import { CloudService } from './cloud/cloud.service';
import { AppController } from './app.controller';
import { EventsController } from './events/events.controller';
import { CitiesController } from './cities/cities.controller';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { SpeakerController } from './speaker/speaker.controller';
import { SpeakerModule } from './speaker/speaker.module';
import { NodemailerService } from './cloud/mail.service';

@Module({
  controllers: [
    AppController,
    EventsController,
    CitiesController,
    CategoriesController,
    MailController,
    SpeakerController,
  ],
  providers: [AppService, CloudService, NodemailerService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    EventsModule,
    AuthModule,
    UsersModule,
    CitiesModule,
    CategoriesModule,
    MailModule,
    SpeakerModule,
  ],
})
export class AppModule {}
