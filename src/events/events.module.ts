import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { EventSchema } from 'src/schema/event.schema';
import { CitySchema } from 'src/schema/city.chema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Event', schema: EventSchema },
      { name: 'City', schema: CitySchema },
    ]),
  ],
  providers: [EventService],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}
