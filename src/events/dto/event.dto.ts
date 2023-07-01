export class EventDto {
  readonly eventId?: string;
  readonly cityId: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly seats: number;
  readonly price: number;
  readonly categories: string;
  readonly showOnHomePage: boolean;
  readonly isHidden: boolean;
  readonly showInCityHome: boolean;
}
