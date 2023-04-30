import { Injectable } from '@nestjs/common';
import { Event } from 'schema/event.schema';
import { City } from 'schema/city.chema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(City.name) private cityModel: Model<City>,
  ) {}

  async getCities() {
    const cities = await this.cityModel.find({}).populate('events');
    return cities;
  }

  async addCity(cityEvent: CityDto, file) {
    const { city, title, country, population } = cityEvent;

    await this.cityModel.create({
      city,
      title,
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

  async getEvent(id) {
    const event = await this.eventModel.findOne({ cityId: id });

    return event;
  }

  async addEvent(eventDto: EventDto) {
    const { cityId, title, description, date, seats } = eventDto;

    const cityEvent = await this.eventModel.findOne({ cityId: cityId });

    if (cityEvent) {
      await this.eventModel.updateOne(
        { cityId },
        { $push: { events: { title, description, date, seats } } },
      );
    } else {
      await this.eventModel.create({
        cityId,
        events: [{ title, description, date, seats }],
      });
    }

    const category = await this.eventModel.find();
    return category;
  }
}
