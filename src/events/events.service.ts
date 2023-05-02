import { Injectable } from '@nestjs/common';
import { Event } from '../schema/event.schema';
import { City } from '../schema/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';
import { CloudService } from '../cloud/cloud.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(City.name) private cityModel: Model<City>,
    private readonly cloudService: CloudService,
  ) {}

  async getCities() {
    const cities = await this.cityModel.find({}).populate('events');
    return cities;
  }

  async addCity(cityEvent: CityDto, file) {
    try {
      const { city, title, country, population } = cityEvent;

      const imagePath = await this.cloudService.addFileCloud(file);

      await this.cityModel.create({
        city,
        title,
        country,
        population,
        imagePath,
      });

      const allCities = await this.cityModel.find({});

      return allCities;
    } catch (err) {
      return err;
    }
  }

  async deleteCity(cityId: string) {
    const city = await this.cityModel.findById(cityId);

    if (city.imagePath) {
      await this.cloudService.deleteFileCloud(city.imagePath);
    }

    const deletedCity = await this.cityModel.deleteOne({ _id: cityId });
    if (deletedCity.deletedCount === 0) {
      throw new Error(`City with ID ${cityId} not found`);
    }
    return `City with ID ${cityId} deleted successfully`;
  }

  async getAllCategories() {
    const category = await this.eventModel.find();
    return category;
  }

  async getEvent(cityId: string) {
    const event = await this.eventModel.findOne({ cityId });
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
