import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { City, CitySchema } from '../schema/city.schema';
import { CloudService } from '../cloud/cloud.service';
import { AccessTokenStrategy } from '../auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../auth/strategies/refreshToken.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  providers: [
    EventService,
    CloudService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [EventsController],
  exports: [EventService],
})
export class EventsModule {}
