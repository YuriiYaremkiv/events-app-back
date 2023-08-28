import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from '../schema/city.schema';
import { SpeakerService } from './speaker.service';
import { CloudService } from 'cloud/cloud.service';
import { SpeakerController } from './speaker.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  providers: [SpeakerService, CloudService],
  controllers: [SpeakerController],
  exports: [SpeakerService],
})
export class SpeakerModule {}
