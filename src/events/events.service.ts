import { Injectable } from '@nestjs/common';
import { Event } from 'src/schema/event.schema';
import { City } from 'src/schema/city.chema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: Model<Event>,
    @InjectModel('City') private cityModel: Model<City>,
  ) {}

  async getCities() {
    const cities = await this.cityModel.find({});
    return cities;
  }

  async addCity(cityEvent: CityDto, file) {
    const { city, country, population } = cityEvent;

    const createdCity = await this.cityModel.create({
      city,
      country,
      population,
    });

    const allCities = await this.cityModel.find({});

    return allCities;
  }

  async getAllCategories() {
    const category = await this.eventModel.find();
    return category;
  }

  async createCategory(eventDto: EventDto) {
    const { title, description, imagePath } = eventDto;

    const category = await this.eventModel.create({
      title,
      description,
      imagePath,
    });
    return category;
  }
}
