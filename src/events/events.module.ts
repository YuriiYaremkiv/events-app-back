import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from '../schema/event.schema';
import { City, CitySchema } from '../schema/city.schema';
import { CloudService } from '../cloud/cloud.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  providers: [EventService, CloudService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}
