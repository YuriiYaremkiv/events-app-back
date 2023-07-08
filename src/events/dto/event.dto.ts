export class EventDto {
  readonly id?: string;
  readonly eventId?: string;
  readonly cityId: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly seats: number;
  readonly price: number;
  readonly categories: string;
  readonly imagePath?: string;
  readonly speakers: any;
  readonly showOnHomePage: string;
  readonly isHidden: string;
  readonly showInCityHome: string;
}
