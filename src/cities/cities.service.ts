import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudService } from '../cloud/cloud.service';
import { City, CityDocument } from '../schema/city.schema';
import { CityDto, RequestCityDto } from './dto';
import { processPaginationParams } from '../config/pagination';
import { ICityItem, IEventItem, CityDataResponse } from '../interfaces';
import { CitySortField } from './dto/req.city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getCity(reqCity: RequestCityDto): Promise<CityDataResponse> {
    const response = await this.getCityOfDatabase(reqCity);
    return response;
  }

  async getCityById(cityId: string) {
    const city = await this.cityModel.findById(cityId);

    if (!city) throw new Error(`City not found`);
    city.events = [];

    return city;
  }

  async addCity({
    reqCity,
    newCity,
    file,
  }: {
    reqCity: RequestCityDto;
    newCity: CityDto;
    file?: Express.Multer.File;
  }): Promise<CityDataResponse> {
    let imagePath = '';
    if (file) imagePath = await this.cloudService.addFileCloud(file);

    await this.cityModel.create({ ...newCity, imagePath });

    const response = await this.getCityOfDatabase(reqCity);
    return response;
  }

  async updateCity({
    updatedCity,
    file,
  }: {
    updatedCity: CityDto;
    file?: Express.Multer.File;
  }): Promise<ICityItem> {
    const { _id: cityId } = updatedCity;

    const currentCity = await this.cityModel.findById(cityId)?.lean();
    if (!currentCity) throw new Error(`City not found`);

    let imagePath = currentCity.imagePath;
    if (file) {
      if (imagePath) await this.cloudService.deleteFileCloud(imagePath);
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const updatedCityData: ICityItem = await this.cityModel
      .findByIdAndUpdate(cityId, { ...updatedCity, imagePath }, { new: true })
      .select('-__v')
      .lean();

    updatedCityData.totalEvents = updatedCityData.events.length;
    updatedCityData.events = [];

    return updatedCityData;
  }

  async deleteCity({
    reqCity,
    cityId,
  }: {
    reqCity: RequestCityDto;
    cityId: string;
  }): Promise<CityDataResponse> {
    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error(`City not found`);

    if (city.imagePath) {
      await this.cloudService.deleteFileCloud(city.imagePath);
    }

    const deletedCity = await this.cityModel.deleteOne({ _id: cityId });
    if (deletedCity.deletedCount === 0) {
      throw new Error(`City not found`);
    }

    const response = await this.getCityOfDatabase(reqCity);
    return response;
  }

  async getCityOfDatabase(req: RequestCityDto): Promise<CityDataResponse> {
    const { skip, limit } = processPaginationParams(req);
    const { query, sort, order, cities, countries, showOnHomePage, isHidden } =
      req;

    const queryObj = {};
    if (!isHidden) queryObj['isHidden'] = false;
    if (showOnHomePage) queryObj['showOnHomePage'] = showOnHomePage;
    if (countries) queryObj['country.label'] = { $in: countries.split(',') };

    if (cities || query) {
      queryObj['city.label'] = { $in: [] };
      if (cities) {
        queryObj['city.label']['$in'] = queryObj['city.label']['$in'].concat(
          cities.split(','),
        );
      }
      if (query) {
        queryObj['city.label'] = { $regex: `.*${query}.*`, $options: 'i' };
      }
    }

    const sortLabel = {};
    switch (sort) {
      case CitySortField.NAME:
        sortLabel['city.label'] = order === 'asc' ? 1 : -1;
        break;
      case CitySortField.RATING:
        sortLabel['rating'] = order === 'asc' ? 1 : -1;
        break;
      case CitySortField.PRIORITY:
        sortLabel['priorityDisplay'] = order === 'asc' ? 1 : -1;
        break;
      default:
        sortLabel['priorityDisplay'] = -1;
    }

    const [totalCities, allCities] = await Promise.all([
      this.cityModel.countDocuments(queryObj),
      this.cityModel
        .find(queryObj)
        .select('-__v')
        .sort(sortLabel)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const response: any = {};
    if (!showOnHomePage) {
      const allCities: ICityItem[] = await this.cityModel.find({}).lean();

      const countries = allCities.reduce((uniqueCountries, city) => {
        if (
          !uniqueCountries.some(
            (country) => country.label === city.country.label,
          )
        ) {
          uniqueCountries.push(city.country);
        }
        return uniqueCountries;
      }, []);
      const cities = [...new Set(allCities.map((city) => city.city))];
      response.searchParams = { countries, cities };
    }

    allCities.forEach((city: any) => {
      city.totalEvents = city.events.length;

      city.events = city.events.reduce(
        (
          acc: {
            title: string;
            date: string;
            imagePath: string;
            rating: number;
          }[],
          event: IEventItem,
        ) => {
          if (event.showInCityHome) {
            acc.push({
              title: event.title,
              date: event.date,
              imagePath: event.imagePath,
              rating: Number(event.rating),
            });
          }
          return acc;
        },
        [],
      );

      return city;
    });

    response.cities = allCities;
    response.totalCities = totalCities;

    return response;
  }
}
