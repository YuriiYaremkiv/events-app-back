import { Types } from 'mongoose';

interface ICountry {
  label: string;
  population: number;
}

interface ICity {
  code: string;
  label: string;
  phone: string;
}

export interface ICategoryEvent {
  label: string;
  color: string;
}

export interface ICategoryItem {
  label: string;
  color: string;
}

export interface ISpeaker {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  about: string;
  email: string;
  topic: string;
  telephone: string;
}

export interface IEventItem {
  id: string;
  title: string;
  rating: number;
  description: string;
  date: string;
  seats: number;
  price: number;
  imagePath: string;
  categories: ICategoryItem[];
  speakers: ISpeaker[];
  language: string;
  minAge: number;
  showOnHomePage: boolean;
  showInCityHome: boolean;
  isHidden: boolean;
}

export interface IEventItemResponse extends IEventItem {
  country?: ICountry;
  city?: ICity;
}

export interface ICityItem {
  _id: Types.ObjectId;
  country: ICountry;
  city: ICity;
  description: string;
  imagePath: string;
  totalEvents?: number;
  showOnHomePage: boolean;
  isHidden: boolean;
  events: IEventItem[];
}

export interface CityDataResponse {
  cities: ICityItem[];
  totalCities: number;
  searchParams?: any;
}

export interface EventDataResponse {
  events: any;
  totalEvents?: number;
  searchParams?: any;
  cityId?: any;
}
