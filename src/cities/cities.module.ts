import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from '../schema/city.schema';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CloudService } from '../cloud/cloud.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  ],
  providers: [CitiesService, CloudService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
