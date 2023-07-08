interface ICountry {
  label: string;
  population: number;
}

interface ICity {
  code: string;
  label: string;
  phone: string;
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
  description: string;
  date: string;
  seats: number;
  price: number;
  imagePath: string;
  categories: ICategoryItem[];
  speakers: ISpeaker[];
  showOnHomePage: boolean;
  showInCityHome: boolean;
  isHidden: boolean;
}

export interface ICityItem {
  _id: any;
  country: ICountry;
  city: ICity;
  description: string;
  imagePath: string;
  totalEvents: number;
  showOnHomePage: boolean;
  isHidden: boolean;
  events: IEventItem[] | any;
}
