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

  async getCity() {
    const cities = await this.cityModel.find({}).populate('events');
    return cities;
  }

  async addCity(cityEvent: CityDto, file) {
    try {
      const { city, title, country, population, showOnHomePage } = cityEvent;
      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';
      const addedCity = await this.cityModel.create({
        city,
        title,
        country,
        population,
        showOnHomePage,
        imagePath,
      });

      return addedCity;
    } catch (err) {
      return err;
    }
  }

  async updateCity(cityEvent: CityDto, file: any) {
    const {
      _id: cityId,
      city,
      title,
      country,
      population,
      showOnHomePage,
    } = cityEvent;

    const updateCity = await this.cityModel.findById(cityId);

    if (!updateCity) {
      throw new Error(`City with ID ${cityId} not found`);
    }

    if (file && updateCity.imagePath) {
      await this.cloudService.deleteFileCloud(updateCity.imagePath);
    }

    const imagePath = file
      ? await this.cloudService.addFileCloud(file)
      : updateCity.imagePath;

    const updatedCity = await this.cityModel.findOneAndUpdate(
      { _id: cityId },
      {
        city,
        title,
        country,
        population,
        showOnHomePage,
        imagePath,
      },
      { new: true },
    );

    return updatedCity;
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
    return cityId;
  }

  async getAllCategories() {
    const category = await this.eventModel.find();
    return category;
  }

  async getEvent(cityId: string) {
    const events = await this.eventModel.findOne({ cityId });
    return events;
  }

  async addEvent(eventDto: EventDto, file: any) {
    const { cityId, title, description, date, seats } = eventDto;

    console.log('cityId', cityId);

    const event = await this.eventModel.findOne({ cityId: cityId });

    if (event) {
      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

      await this.eventModel.updateOne(
        { cityId },
        { $push: { events: { title, description, date, seats, imagePath } } },
      );
    } else {
      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

      await this.eventModel.create({
        cityId,
        events: [{ title, description, date, seats, imagePath }],
      });
    }

    const events = await this.eventModel.findOne({ cityId });
    return events;
  }
}
