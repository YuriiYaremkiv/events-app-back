import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from 'schema/event.schema';
import { City, CitySchema } from 'schema/city.chema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  providers: [EventService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}
