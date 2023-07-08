import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudService } from '../cloud/cloud.service';
import { City, CityDocument } from '../schema/city.schema';
import { Model } from 'mongoose';
import { CityCreateDto, CityUpdateDto, RequestCityDto } from './dto';
import { processPaginationParams } from '../config/pagination';
import { ICityItem, IEventItem } from 'interfaces';

interface IAddCityProps {
  reqCity: RequestCityDto;
  newCity: CityCreateDto;
  file: Express.Multer.File | null;
}

interface IUpdateCityProps {
  updatedCity: CityUpdateDto;
  file: Express.Multer.File | null;
}

interface IDeleteCityProps {
  reqCity: RequestCityDto;
  cityId: string;
}

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getCity({ reqCity }: { reqCity: RequestCityDto }) {
    const response = await this.getCityOfDatabase(reqCity);
    return response;
  }

  async addCity({ reqCity, newCity, file }: IAddCityProps) {
    const cityObject = this.createCityObject(newCity);

    if (file) {
      const imagePath = await this.cloudService.addFileCloud(file);
      cityObject.imagePath = imagePath;
    }
    await this.cityModel.create(cityObject);

    const response = await this.getCityOfDatabase(reqCity);
    return response;
  }

  async updateCity({ updatedCity, file }: IUpdateCityProps) {
    const cityObject = this.createCityObject(updatedCity);
    const { _id: cityId, imagePath: currentImage } = updatedCity;

    const currentCity = await this.cityModel.findById(cityId);

    if (!currentCity) {
      throw new Error(`City not found`);
    }

    let imagePath = currentImage;
    if (file) {
      if (currentImage) await this.cloudService.deleteFileCloud(currentImage);
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const updatedCityData = await this.cityModel.findByIdAndUpdate(
      cityId,
      { ...cityObject, imagePath },
      { new: true },
    );

    return updatedCityData;
  }

  async deleteCity({ reqCity, cityId }: IDeleteCityProps) {
    const city = await this.cityModel.findById(cityId);

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

  createCityObject(cityDto: CityCreateDto) {
    const { country, city, description, imagePath, showOnHomePage, isHidden } =
      cityDto;

    const newCity: any = {
      country: JSON.parse(country),
      city: JSON.parse(city),
      description: description,
      showOnHomePage: JSON.parse(showOnHomePage) || false,
      isHidden: JSON.parse(isHidden) || false,
    };

    if (imagePath) {
      newCity.imagePath = newCity;
    }

    return newCity;
  }

  async getCityOfDatabase(req: RequestCityDto) {
    const { skip, limit } = processPaginationParams(req);
    const { cities, countries, showOnHomePage, isHidden } = req;

    const query = {};
    if (!isHidden) query['isHidden'] = false;
    if (showOnHomePage) query['showOnHomePage'] = showOnHomePage;
    if (countries) query['country.label'] = { $in: countries.split(',') };
    if (cities) query['city.label'] = { $in: cities.split(',') };

    const [totalCities, allCities] = await Promise.all([
      this.cityModel.countDocuments(),
      this.cityModel.find(query).select('-__v').skip(skip).limit(limit).lean(),
    ]);

    const response: any = {};
    if (!showOnHomePage) {
      const allCities: ICityItem[] = await this.cityModel.find({}).lean();

      const countries = [...new Set(allCities.map((city) => city.country))];
      const cities = [...new Set(allCities.map((city) => city.city))];
      response.searchParams = { countries, cities };
    }

    allCities.forEach((city: any) => {
      city.totalEvents = city.events.length;

      city.events = city.events.reduce((acc: any, event: IEventItem) => {
        if (event.showInCityHome) {
          acc.push({
            title: event.title,
            date: event.date,
            imagePath: event.imagePath,
          });
        }
        return acc;
      }, []);

      return city;
    });

    response.cities = allCities;
    response.totalCities = totalCities;

    return response;
  }
}
