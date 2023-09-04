import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { UpdatedCountryDto } from './dto/country.dto';
import { CountrySortField, RequestCountryDto } from './dto/req.country.dto';
import { processPaginationParams } from '../config/pagination';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async getCountry(reqCountry: RequestCountryDto) {
    const response = await this.getCountryOfDatabase(reqCountry);
    return response;
  }

  async addCountry({ newCountry, reqCountry }: any) {
    await this.countryModel.create({ ...newCountry });

    const response = await this.getCountryOfDatabase(reqCountry);
    return response;
  }

  async updateCountry(updatedCountry: UpdatedCountryDto) {
    const { _id, ...updatedValues } = updatedCountry;

    const country = await this.countryModel.findByIdAndUpdate(
      _id,
      { ...updatedValues },
      { new: true },
    );

    return country;
  }

  async deleteCountry({ countryId, reqCountry }: any) {
    const deletedCountry = await this.countryModel.deleteOne({
      _id: countryId,
    });

    if (deletedCountry.deletedCount === 0) throw new Error(`City not found`);

    const response = await this.getCountryOfDatabase(reqCountry);
    return response;
  }

  async getCountryOfDatabase(reqCountry: RequestCountryDto) {
    const { skip, limit } = processPaginationParams(reqCountry);
    const { query, sort, order } = reqCountry;

    const queryObj = {};
    if (query) queryObj['label'] = { $regex: `.*${query}.*`, $options: 'i' };

    const sortLabel = {};
    switch (sort) {
      case CountrySortField.NAME:
        sortLabel['label'] = order === 'asc' ? 1 : -1;
        break;
      default:
        sortLabel['label'] = order === 'asc' ? 1 : -1;
    }

    const [totalCountries, countries] = await Promise.all([
      this.countryModel.countDocuments(queryObj),
      this.countryModel
        .find(queryObj)
        .select('-__v')
        .sort(sortLabel)
        .skip(skip)
        .limit(limit),
    ]);

    return { countries, totalCountries };
  }
}
