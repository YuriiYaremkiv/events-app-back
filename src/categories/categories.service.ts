import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { CountryDto } from './dto/country.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async getCountry() {
    const response = await this.getCountryOfDatabase();
    return response;
  }

  async addCountry(newCountry: CountryDto) {
    await this.countryModel.create({ ...newCountry });

    const response = await this.getCountryOfDatabase();
    return response;
  }

  async updateCountry({
    countryId,
    updatedCountry,
  }: {
    countryId: string;
    updatedCountry: CountryDto;
  }) {
    await this.countryModel.findByIdAndUpdate(
      countryId,
      { ...updatedCountry },
      { new: true },
    );

    const response = await this.getCountryOfDatabase();
    return response;
  }

  async deleteCountry(countryId: string) {
    const deletedCountry = await this.countryModel.deleteOne({
      _id: countryId,
    });
    if (deletedCountry.deletedCount === 0) throw new Error(`City not found`);

    const response = await this.getCountryOfDatabase();
    return response;
  }

  async getCountryOfDatabase() {
    const countries = await this.countryModel.find({}).select('-__v');
    return countries;
  }
}
