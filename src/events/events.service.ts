import { Length } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from '../schema/event.schema';
import { City, CityDocument } from '../schema/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';
import { CloudService } from '../cloud/cloud.service';
import { v4 as uuidv4 } from 'uuid';
import { processPaginationParams } from '../config/pagination';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getCities(req: any) {
    const { skip, limit } = processPaginationParams(req);
    const { cities, countries, showOnHomePage, isHidden, showInCityHome } = req;

    const query = {};
    if (!isHidden) query['isHidden'] = false;
    if (showOnHomePage) query['showOnHomePage'] = showOnHomePage;
    if (countries) query['country.label'] = { $in: countries.split(',') };
    if (cities) query['city.label'] = { $in: cities.split(',') };

    const [totalCities, allCities] = await Promise.all([
      this.cityModel.countDocuments(),
      this.cityModel.find(query).skip(skip).limit(limit).lean(),
    ]);

    allCities.forEach((city: any) => {
      city.totalEvents = city.events.length;
      if (showInCityHome) {
        city.events = city.events.filter(
          (event: any) => event.showInCityHome && !event.isHidden,
        );
      } else {
        city.events = [];
      }

      return city;
    });

    const uniqueCountries = [...new Set(allCities.map((city) => city.country))];
    const uniqueCities = [...new Set(allCities.map((city) => city.city))];

    return {
      cities: allCities,
      totalCities,
      searchParams: {
        countries: uniqueCountries,
        cities: uniqueCities,
      },
    };
  }

  // async getCity(req: any) {
  //   const { skip, limit } = processPaginationParams(req);

  //   console.log('this is console', req);

  //   const totalCounts = await this.cityModel.countDocuments();
  //   const events = await this.cityModel.find({}).skip(skip).limit(limit);

  //   return { cities: events, totalCities: totalCounts };
  // }

  async addCity(cityEvent: any, file) {
    try {
      const { city, title, country, population, showOnHomePage, isHidden } =
        cityEvent;

      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';
      const addedCity = await this.cityModel.create({
        city: JSON.parse(city),
        title,
        country: JSON.parse(country),
        imagePath,
        population,
        showOnHomePage,
        isHidden,
      });

      return addedCity;
    } catch (err) {
      return err;
    }
  }

  async updateCity(cityEvent: any, file: any) {
    const {
      _id: cityId,
      city,
      title,
      country,
      population,
      showOnHomePage,
      isHidden,
    } = cityEvent;

    console.log('cityEvent', cityEvent);

    console.log('isHidden', isHidden);
    console.log('typeof isHidden', typeof isHidden);

    try {
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
          city: JSON.parse(city),
          title,
          country: JSON.parse(country),
          population,
          showOnHomePage,
          isHidden,
          imagePath,
        },
        { new: true },
      );

      return updatedCity;
    } catch (err) {
      return err.message;
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
    return cityId;
  }

  async getAllCategories() {
    const category = await this.eventModel.find();
    return category;
  }

  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------

  async getEvents({ cityName, req }: { cityName: string; req: any }) {
    const { skip, limit } = processPaginationParams(req);

    console.log('getEvents');

    const city: any = await this.cityModel.findOne({
      'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
    });

    if (!city) return null;

    const totalEvents = city.events.length;
    const events = city.events.slice(skip, skip + limit);

    const eventsParamsForQuery = {
      dateStart: '',
      dateEnd: '',
      seatsMin: 0,
      seatsMax: 0,
      priceMin: 0,
      priceMax: 0,
      categories: [],
      totalEvents: 0,
      cityName: city.city.label,
      cityId: city._id,
    };

    return { events, totalEvents, eventsParams: eventsParamsForQuery };
  }

  async getSingleEvent({
    cityName,
    eventName,
  }: {
    cityName: string;
    eventName: string;
  }) {
    console.log(cityName, eventName);

    const city: any = await this.cityModel.findOne({
      'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
    });

    if (!city) return null;

    const event = city.events.find(
      (event: any) => event.title.toLowerCase() === eventName.toLowerCase(),
    );

    return { event };
  }

  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------

  async getAllEvents(req: any) {
    const cities = await this.cityModel.find({}).lean();

    const allEvents = cities.flatMap((city) => {
      const updatedEvents = city.events.map((event) => ({
        ...event,
        city: city.city,
        country: city.country,
      }));
      return updatedEvents;
    });

    const filteredEvents = allEvents.filter((event) => event.showOnHomePage);

    return { events: filteredEvents };
  }

  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------------------------------------------
  async addEvent(eventDto: any, file: any) {
    let imagePath = '';
    const {
      cityId,
      title,
      description,
      date,
      seats,
      price,
      categories,
      showOnHomePage,
      showInCityHome,
    } = eventDto;

    const city = await this.cityModel.findById(cityId);
    if (city) {
      imagePath = file ? await this.cloudService.addFileCloud(file) : '';

      const newEvent: any = {
        id: uuidv4(),
        title,
        description,
        date,
        seats,
        price,
        categories: JSON.parse(categories),
        imagePath,
        showOnHomePage: JSON.parse(showOnHomePage),
        showInCityHome: JSON.parse(showInCityHome),
      };
      city.events.push(newEvent);
      await city.save();
    }

    const updatedCity = await this.cityModel.findById(cityId);
    return { events: updatedCity.events, cityId };
  }

  async updateEvent(eventDto: any, file: any) {
    let imagePath = '';
    const {
      eventId,
      cityId,
      title,
      description,
      date,
      seats,
      price,
      categories,
      showOnHomePage,
      isHidden,
      showInCityHome,
    } = eventDto;

    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error('City not found');

    const foundEventIndex = city.events.findIndex((e: any) => e.id === eventId);
    if (foundEventIndex === -1) {
      throw new Error('Event not found');
    }

    const foundEvent = city.events[foundEventIndex];
    imagePath = foundEvent.imagePath;

    if (file && !foundEvent.imagePath) {
      imagePath = await this.cloudService.addFileCloud(file);
    }

    if (file && foundEvent.imagePath) {
      await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const updatedEvent = {
      ...foundEvent,
      title,
      description,
      date,
      seats,
      imagePath,
      price,
      categories: JSON.parse(categories),
      showOnHomePage: JSON.parse(showOnHomePage),
      isHidden: JSON.parse(isHidden),
      showInCityHome: JSON.parse(showInCityHome),
    };

    city.events[foundEventIndex] = updatedEvent;
    await city.save();

    return { updatedEvent, cityId };
  }

  async deleteEvent({ cityId, eventId }: { cityId: string; eventId: string }) {
    const city = await this.cityModel.findById(cityId);
    const foundEventIndex = city.events.findIndex((e) => e.id === eventId);

    if (foundEventIndex !== -1) {
      const foundEvent = city.events[foundEventIndex];

      if (foundEvent.imagePath) {
        await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      }

      city.events.splice(foundEventIndex, 1);
      await city.save();
    }

    const updatedCity = await this.cityModel.findById(cityId);
    return { events: updatedCity.events, cityId };
  }
}
