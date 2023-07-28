import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EventDto } from './dto/event.dto';
import { CloudService } from '../cloud/cloud.service';
import { RequestEventDto } from './dto';
import { City, CityDocument } from '../schema/city.schema';
import { processPaginationParams } from '../config/pagination';
import {
  ICityItem,
  IEventItem,
  ICategoryEvent,
  EventDataResponse,
  IEventItemResponse,
} from '../interfaces';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getEvent({
    reqEvent,
    cityName,
    eventName,
  }: {
    reqEvent: RequestEventDto;
    cityName?: string;
    eventName?: string;
  }): Promise<any> {
    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName,
      eventName,
    });

    return response;
  }

  async addEvent({
    reqEvent,
    newEvent,
    file,
  }: {
    reqEvent: RequestEventDto;
    newEvent: EventDto;
    file?: Express.Multer.File;
  }): Promise<EventDataResponse> {
    const { cityId, ...bodyNewEvent } = newEvent;

    const currentCity = await this.cityModel.findById(cityId);
    if (!currentCity) throw new Error(`City not found`);

    const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

    const id = uuidv4();
    currentCity.events.push({ id, ...bodyNewEvent, imagePath });
    await currentCity.save();

    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName: currentCity.city.label,
    });
    return { ...response, cityId: currentCity._id };
  }

  async updateEvent({
    updatedEvent,
    file,
  }: {
    updatedEvent: EventDto;
    file?: Express.Multer.File;
  }): Promise<any> {
    const { cityId, eventId, ...bodyUpdatedEvent } = updatedEvent;

    const currentCity = await this.cityModel.findById(cityId);
    if (!currentCity) throw new Error(`City not found`);

    const eventIndex = currentCity.events.findIndex(
      (event: IEventItem) => event.id === eventId,
    );
    if (eventIndex === -1) throw new Error('Event not found');

    const foundEvent = currentCity.events[eventIndex];
    let imagePath = foundEvent.imagePath;

    if (file) {
      if (foundEvent.imagePath) {
        await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      }
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const newBodyEvent = {
      ...bodyUpdatedEvent,
      imagePath: imagePath || foundEvent.imagePath,
      id: eventId,
    };

    currentCity.events[eventIndex] = newBodyEvent;
    await currentCity.save();

    return { updatedEvent: newBodyEvent, cityId };
  }

  async deleteEvent({
    reqEvent,
    cityId,
    eventId,
  }: {
    reqEvent: RequestEventDto;
    cityId: string;
    eventId: string;
  }): Promise<EventDataResponse> {
    const currentCity = await this.cityModel.findById(cityId);
    const foundEventIndex = currentCity.events.findIndex(
      (event: IEventItem) => event.id === eventId,
    );

    if (foundEventIndex !== -1) {
      const foundEvent = currentCity.events[foundEventIndex];

      if (foundEvent.imagePath) {
        await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      }

      currentCity.events.splice(foundEventIndex, 1);
      await currentCity.save();
    }

    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName: currentCity.city.label,
    });
    return response;
  }

  async getEventOfDatabase({
    reqEvent,
    cityName,
    eventName,
  }: {
    reqEvent: RequestEventDto;
    cityName?: string;
    eventName?: string;
  }) {
    const { skip, limit } = processPaginationParams(reqEvent);

    if (cityName && eventName) {
      const city: ICityItem = await this.cityModel
        .findOne({
          'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
        })
        .lean();
      if (!city) return null;
      const event: IEventItemResponse = city.events.find(
        (event: IEventItem) =>
          event.title.toLowerCase() === eventName.toLowerCase(),
      );
      event.country = city.country;
      event.city = city.city;

      return { events: event };
    }

    if (!cityName) {
      const cities = await this.cityModel.find({}).lean();
      const allEvents = cities
        .flatMap((city) => {
          const updatedEvents = city.events.map((event) => ({
            ...event,
            city: city.city,
            country: city.country,
          }));
          return updatedEvents;
        })
        .sort((a, b) => b.priorityDisplay - a.priorityDisplay);

      const filteredEvents = allEvents.filter((event) => event.showOnHomePage);
      return { events: filteredEvents };
    }

    const city: ICityItem = await this.cityModel.findOne({
      'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
    });

    if (!city) {
      return null;
    }

    const filteredEvents = this.getFilteredEvents({
      reqEvent,
      events: city.events,
    });

    const totalEvents = filteredEvents.length;
    const events = filteredEvents.slice(skip, skip + limit);

    const eventsParamsForQuery = this.getSearchParamsOfCity({ city });

    return {
      events,
      totalEvents,
      searchParams: eventsParamsForQuery,
      cityId: city._id,
    };
  }

  getFilteredEvents({
    reqEvent,
    events,
  }: {
    reqEvent: any;
    events: IEventItem[];
  }) {
    const {
      query,
      dateStart,
      dateEnd,
      priceMin,
      priceMax,
      seatsMin,
      seatsMax,
      categories,
    } = reqEvent;

    const filteredEvents = events.filter((event: IEventItem) => {
      if (query) {
        if (
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        }
        return false;
      }

      if (new Date(dateStart) >= new Date(event.date)) return false;
      if (new Date(dateEnd) >= new Date(event.date)) return false;

      if (priceMin >= event.price) return false;
      if (priceMax <= event.price) return false;

      if (seatsMin >= event.seats) return false;
      if (seatsMax <= event.seats) return false;

      if (categories) {
        const allCategoriesEvent = event.categories.map(
          (cat: ICategoryEvent) => cat.label,
        );
        const allcat = categories.split(',');

        for (const cat of allcat) {
          if (allCategoriesEvent.includes(cat)) return true;
        }
        return false;
      }

      return true;
    });

    return filteredEvents;
  }

  getSearchParamsOfCity({ city }: { city: ICityItem }) {
    const seatsMin = 0;
    const priceMin = 0;
    let seatsMax = 0;
    let priceMax = 0;
    const categories = [];

    city.events.forEach((event: IEventItem) => {
      if (seatsMax < event.seats) seatsMax = Number(event.seats);
      if (priceMax < event.price) priceMax = Number(event.seats);
      categories.push(...event.categories);
    });

    const uniqueCategories = categories.filter(
      (category: ICategoryEvent, index: number) => {
        return !categories.some(
          (c, i) => c.label === category.label && i < index,
        );
      },
    );

    return {
      seatsMin,
      seatsMax,
      priceMin,
      priceMax,
      categories: uniqueCategories,
    };
  }
}
