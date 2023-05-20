import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from '../schema/event.schema';
import { City, CityDocument } from '../schema/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { CityDto } from './dto/city.dto';
import { CloudService } from '../cloud/cloud.service';
import { v4 as uuidv4 } from 'uuid';
import { processPaginationParams } from 'config/pagination';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getCity(req: any) {
    try {
      const { skip, limit, sort } = processPaginationParams(req);

      const cities = await this.cityModel.aggregate([
        {
          $lookup: {
            from: 'events',
            localField: '_id',
            foreignField: 'cityId',
            as: 'events',
          },
        },
        { $unwind: { path: '$events', preserveNullAndEmptyArrays: true } },
        { $addFields: { events: { $ifNull: ['$events.events', []] } } },
        { $skip: skip },
        { $limit: Number(limit) },
      ]);

      const totalCounts = await this.cityModel.countDocuments();

      for (const city of cities) {
        const data = city.events.reduce((acc, event) => {
          const eventDate = new Date(event.date);

          if (
            (!acc || eventDate < new Date(acc?.date)) &&
            eventDate.getTime() > Date.now()
          ) {
            acc = event;
          }

          return acc;
        }, null);

        city.upcomingEvent = data;
        city.totalEvents = city.events.length;
        city.events = [];
      }

      return { cities, totalCounts };
    } catch (err) {
      throw new Error(`Failed to get cities: ${err.message}`);
    }
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

  async getEvent({ cityName, req }: { cityName: string; req: any }) {
    console.log('this is req', req);
    const { skip, limit, sort } = processPaginationParams(req);

    const formattedCityName = cityName.replace(/\s+/g, '-');
    const regex = new RegExp(formattedCityName, 'i');
    const currentCity = await this.cityModel.findOne({
      city: { $regex: regex },
    });

    const cityId = currentCity._id;
    const events = await this.eventModel.findOne({ cityId });
    const limitedEvents = events.events.slice(skip, skip + Number(limit));

    const eventsParams: any = events.events.reduce(
      (acc, ev, _, array) => {
        if (!acc.dateStart || new Date(acc.dateStart) >= new Date(ev.date))
          acc.dateStart = ev.date;
        if (!acc.dateEnd || new Date(acc.dateEnd) <= new Date(ev.date))
          acc.dateEnd = ev.date;
        if (acc.seatsMin >= Number(ev.seats)) acc.seatsMin = Number(ev.seats);
        if (acc.seatsMax <= Number(ev.seats)) acc.seatsMax = Number(ev.seats);
        if (acc.priceMin >= Number(ev.price)) acc.priceMin = Number(ev.price);
        if (acc.priceMax <= Number(ev.price)) acc.priceMax = Number(ev.price);
        acc.categories = Array.from(
          new Set([...acc.categories, ...(ev.categories || [])]),
        );
        acc.totalEvents = array.length;
        return acc;
      },
      {
        dateStart: '',
        dateEnd: '',
        seatsMin: 0,
        seatsMax: 0,
        priceMin: 0,
        priceMax: 0,
        categories: [],
        totalEvents: 0,
        cityName: currentCity.city,
        cityId: currentCity._id,
      },
    );

    return {
      events: limitedEvents,
      eventsParams,
      city: currentCity.city,
    };
  }

  async addEvent(eventDto: EventDto, file: any) {
    const { cityId, title, description, date, seats, price, categories } =
      eventDto;

    const event = await this.eventModel.findOne({ cityId: cityId });

    if (event) {
      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

      await this.eventModel.updateOne(
        { cityId },
        {
          $push: {
            events: {
              id: uuidv4(),
              title,
              description,
              date,
              seats,
              price,
              categories: categories.split(','),
              imagePath,
            },
          },
        },
      );
    } else {
      const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

      await this.eventModel.create({
        cityId,
        events: [{ id: uuidv4(), title, description, date, seats, imagePath }],
      });
    }

    const events = await this.eventModel.findOne({ cityId });
    return events;
  }

  async updateEvent(eventDto: EventDto, file: any) {
    let imagePath = '';
    const { eventId, cityId, title, description, date, seats } = eventDto;

    const event = await this.eventModel.findOne({ cityId: cityId });
    const foundEvent = event.events.find((e) => e.id === eventId);

    imagePath = foundEvent.imagePath;

    if (file && !foundEvent.imagePath) {
      imagePath = await this.cloudService.addFileCloud(file);
    }

    if (file && foundEvent.imagePath) {
      await this.cloudService.deleteFileCloud(foundEvent.imagePath);
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const updatedEvent = await this.eventModel
      .findOneAndUpdate(
        { cityId, 'events.id': eventId },
        {
          $set: {
            'events.$.title': title,
            'events.$.description': description,
            'events.$.date': date,
            'events.$.seats': seats,
            'events.$.imagePath': imagePath,
          },
        },
        { new: true },
      )
      .exec();

    return updatedEvent;
  }

  async deleteEvent({ cityId, eventId }: { cityId: string; eventId: string }) {
    console.log('cityId', cityId, 'eventId', eventId);

    const event = await this.eventModel.findOne({ cityId: cityId });
    const foundEvent = event.events.find((e) => e.id === eventId);

    if (foundEvent.imagePath) {
      await this.cloudService.deleteFileCloud(foundEvent.imagePath);
    }

    const updatedDoc = await this.eventModel.findOneAndUpdate(
      { cityId },
      { $pull: { events: { id: eventId } } },
      { new: true },
    );
    return updatedDoc;
  }
}
