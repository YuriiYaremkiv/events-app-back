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

  async getCityToHomePage() {
    const eventsFromHomePage = await this.cityModel.find({
      showOnHomePage: true,
    });

    return eventsFromHomePage;
  }

  async getCities(req: any) {
    const { skip, limit } = processPaginationParams(req);

    const totalCounts = await this.cityModel.countDocuments();
    const events = await this.cityModel.find({}).skip(skip).limit(limit);

    return { cities: events, totalCities: totalCounts };
  }

  async getCity(req: any) {
    const { skip, limit } = processPaginationParams(req);

    const totalCounts = await this.cityModel.countDocuments();
    const events = await this.cityModel.find({}).skip(skip).limit(limit);

    return { cities: events, totalCities: totalCounts };
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

  async getEventsOfCity({ cityName, req }: { cityName: string; req }) {
    const city = await this.cityModel.findOne({ city: cityName });

    const eventsParams = {
      dateStart: '',
      dateEnd: '',
      seatsMin: 0,
      seatsMax: 0,
      priceMin: 0,
      priceMax: 0,
      categories: [],
      totalEvents: 0,
      cityName: city.city,
      cityId: city._id,
    };

    return { events: city.events, eventsParams };
  }

  async addEvent(eventDto: EventDto, file: any) {
    let imagePath = '';
    const { cityId, title, description, date, seats, price, categories } =
      eventDto;

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
        categories: categories.split(','),
        imagePath,
      };
      city.events.push(newEvent);
      await city.save();
    }

    const updatedCity = await this.cityModel.findById(cityId);
    return { events: updatedCity.events, cityId };
  }

  async updateEvent(eventDto: EventDto, file: any) {
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
      categories,
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

// async addEvent(eventDto: EventDto, file: any) {
//     const { cityId, title, description, date, seats, price, categories } =
//       eventDto;

//     const event = await this.eventModel.findOne({ cityId: cityId });

//     if (event) {
//       const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

//       await this.eventModel.updateOne(
//         { cityId },
//         {
//           $push: {
//             events: {
//               id: uuidv4(),
//               title,
//               description,
//               date,
//               seats,
//               price,
//               categories: categories.split(','),
//               imagePath,
//             },
//           },
//         },
//       );
//     } else {
//       const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

//       await this.eventModel.create({
//         cityId,
//         events: [{ id: uuidv4(), title, description, date, seats, imagePath }],
//       });
//     }

//     const events = await this.eventModel.findOne({ cityId });
//     return events;
//   }

// async updateEvent(eventDto: EventDto, file: any) {
//     let imagePath = '';
//     const { eventId, cityId, title, description, date, seats } = eventDto;

//     const event = await this.eventModel.findOne({ cityId: cityId });
//     const foundEvent = event.events.find((e) => e.id === eventId);

//     imagePath = foundEvent.imagePath;

//     if (file && !foundEvent.imagePath) {
//       imagePath = await this.cloudService.addFileCloud(file);
//     }

//     if (file && foundEvent.imagePath) {
//       await this.cloudService.deleteFileCloud(foundEvent.imagePath);
//       imagePath = await this.cloudService.addFileCloud(file);
//     }

//     const updatedEvent = await this.eventModel
//       .findOneAndUpdate(
//         { cityId, 'events.id': eventId },
//         {
//           $set: {
//             'events.$.title': title,
//             'events.$.description': description,
//             'events.$.date': date,
//             'events.$.seats': seats,
//             'events.$.imagePath': imagePath,
//           },
//         },
//         { new: true },
//       )
//       .exec();

//     return updatedEvent;
//   }

//  async getEvent({ cityName, req }: { cityName: string; req }) {
//     const {
//       page,
//       limit,
//       searchQuery,
//       dateStart,
//       dataEnd,
//       categories,
//       seatsMin,
//       seatsMax,
//       priceMin,
//       priceMax,
//       hasFreePlaces,
//     } = req;

//     const { skip, sort } = processPaginationParams(req);

//     const formattedCityName = cityName.replace(/\s+/g, '-');
//     const regex = new RegExp(formattedCityName, 'i');
//     const currentCity = await this.cityModel.findOne({
//       city: { $regex: regex },
//     });

//     const cityId = currentCity._id;
//     const events = await this.eventModel.findOne({ cityId });

//     const eventsParams: any = events.events.reduce(
//       (acc, ev, _, array) => {
//         if (!acc.dateStart || new Date(acc.dateStart) >= new Date(ev.date))
//           acc.dateStart = ev.date;
//         if (!acc.dateEnd || new Date(acc.dateEnd) <= new Date(ev.date))
//           acc.dateEnd = ev.date;
//         if (acc.seatsMin >= ev.seats) acc.seatsMin = +ev.seats;
//         if (acc.seatsMax <= ev.seats) acc.seatsMax = +ev.seats;
//         if (acc.priceMin >= ev.price) acc.priceMin = +ev.price;
//         if (acc.priceMax <= ev.price) acc.priceMax = +ev.price;
//         acc.categories = Array.from(
//           new Set([...acc.categories, ...(ev.categories || [])]),
//         );
//         acc.totalEvents = array.length;
//         return acc;
//       },
//       {
//         dateStart: '',
//         dateEnd: '',
//         seatsMin: 0,
//         seatsMax: 0,
//         priceMin: 0,
//         priceMax: 0,
//         categories: [],
//         totalEvents: 0,
//         cityName: currentCity.city,
//         cityId: currentCity._id,
//       },
//     );

//     const filtredEvents = events.events.filter((event) => {
//       if (searchQuery && !event.title.includes(searchQuery)) return false;
//       if (searchQuery && !event.description.includes(searchQuery)) return false;

//       if (dateStart && new Date(dateStart) > new Date(event.date)) return false;
//       if (dataEnd && new Date(dataEnd) < new Date(event.date)) return false;

//       if (categories) {
//         for (const cat of categories) {
//           const newArray: string[] = Array.from(event.categories);
//           if (!newArray.includes(cat)) return false;
//         }
//       }

//       if (seatsMin && +seatsMin > +event.seats) return false;
//       if (seatsMax && +seatsMax < +event.seats) return false;
//       if (priceMin && +priceMin > +event.price) return false;
//       if (priceMax && +priceMax < +event.price) return false;

//       return true;
//     });

//     return {
//       events: filtredEvents,
//       filtredEvents: filtredEvents,
//       eventsParams,
//       city: currentCity.city,
//     };
//   }

// async deleteEvent({ cityId, eventId }: { cityId: string; eventId: string }) {
//   console.log('cityId', cityId, 'eventId', eventId);

//   const event = await this.eventModel.findOne({ cityId: cityId });
//   const foundEvent = event.events.find((e) => e.id === eventId);

//   if (foundEvent.imagePath) {
//     await this.cloudService.deleteFileCloud(foundEvent.imagePath);
//   }

//   const updatedDoc = await this.eventModel.findOneAndUpdate(
//     { cityId },
//     { $pull: { events: { id: eventId } } },
//     { new: true },
//   );
//   return updatedDoc;
// }
