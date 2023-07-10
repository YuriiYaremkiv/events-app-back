import { Injectable } from '@nestjs/common';
import { City, CityDocument } from '../schema/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudService } from '../cloud/cloud.service';
import { v4 as uuidv4 } from 'uuid';
import { processPaginationParams } from '../config/pagination';
import { RequestEventDto } from './dto';
import { EventDto } from './dto/event.dto';

interface IGetEvent {
  reqEvent: RequestEventDto;
  cityName?: string;
  eventName?: string;
}

interface IAddEvent {
  reqEvent: RequestEventDto;
  newEvent: EventDto;
  file: Express.Multer.File | null;
}

interface IUpdateEvent {
  updatedEvent: EventDto;
  file: Express.Multer.File | null;
}

interface IDeleteEvent {
  reqEvent: RequestEventDto;
  cityId: string;
  eventId: string;
}

@Injectable()
export class EventService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getEvent({ reqEvent, cityName, eventName }: IGetEvent) {
    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName,
      eventName,
    });

    return response;
  }

  async addEvent({ reqEvent, newEvent, file }: IAddEvent) {
    const { cityId } = newEvent;

    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error(`City not found`);

    const eventObject = this.createEventObject(newEvent);
    const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

    const id = uuidv4();
    city.events.push({ id: id, ...eventObject, imagePath });
    await city.save();

    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName: city.city.label,
    });
    return { ...response, cityId: city._id };
  }

  async updateEvent({ updatedEvent, file }: IUpdateEvent) {
    const { cityId, eventId } = updatedEvent;

    const city = await this.cityModel.findById(cityId);
    if (!city) {
      throw new Error(`City not found`);
    }

    const eventIndex = city.events.findIndex(
      (event: any) => event.id === eventId,
    );
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    const foundEvent = city.events[eventIndex];
    let imagePath = foundEvent.imagePath;

    if (file && !foundEvent.imagePath) {
      imagePath = await this.cloudService.addFileCloud(file);
    } else if (file && foundEvent.imagePath) {
      await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const updatedEventObject = {
      ...this.createEventObject(updatedEvent),
      imagePath: imagePath || foundEvent.imagePath,
      id: eventId,
    };

    city.events[eventIndex] = updatedEventObject;
    await city.save();

    return { updatedEvent: updatedEventObject, cityId };
  }

  async deleteEvent({ reqEvent, cityId, eventId }: IDeleteEvent) {
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

    const response = await this.getEventOfDatabase({
      reqEvent,
      cityName: city.city.label,
    });
    return response;
  }

  createEventObject(eventDto: EventDto) {
    const {
      title,
      description,
      date,
      seats,
      price,
      imagePath,
      categories,
      showOnHomePage,
      showInCityHome,
      speakers,
    } = eventDto;

    const newEvent: any = {
      title,
      description,
      date,
      seats,
      price,
      categories: JSON.parse(categories),
      showOnHomePage: JSON.parse(showOnHomePage),
      showInCityHome: JSON.parse(showInCityHome),
      speakers: JSON.parse(speakers),
    };

    if (imagePath) {
      newEvent.imagePath = newEvent;
    }

    return newEvent;
  }

  async getEventOfDatabase({ reqEvent, cityName, eventName }: IGetEvent) {
    const { skip, limit } = processPaginationParams(reqEvent);

    if (cityName && eventName) {
      const city: any = await this.cityModel.findOne({
        'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
      });
      if (!city) return null;
      const event = city.events.find(
        (event: any) => event.title.toLowerCase() === eventName.toLowerCase(),
      );
      return { event };
    }

    if (!cityName) {
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

    const city: any = await this.cityModel.findOne({
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
      filteredEvents,
    };
  }

  getFilteredEvents({ reqEvent, events }: any) {
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

    const filteredEvents = events.filter((event: any) => {
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
          (cat: any) => cat.label,
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

  getSearchParamsOfCity({ city }: any) {
    const seatsMin = 0;
    const priceMin = 0;
    let seatsMax = 0;
    let priceMax = 0;
    const categories = [];

    city.events.forEach((event: any) => {
      if (seatsMax < event.seats) seatsMax = Number(event.seats);
      if (priceMax < event.price) priceMax = Number(event.seats);
      categories.push(...event.categories);
    });

    const uniqueCategories = categories.filter((category, index: number) => {
      return !categories.some(
        (c, i) => c.label === category.label && i < index,
      );
    });

    return {
      seatsMin,
      seatsMax,
      priceMin,
      priceMax,
      categories: uniqueCategories,
    };
  }
}
