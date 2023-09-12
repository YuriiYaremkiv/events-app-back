import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NodemailerService } from '../cloud/mail.service';
import { City, CityDocument } from '../schema/city.schema';
import { RegisterEventDto } from './dto/register.event.dto';
import { registerLetter } from './letter/register.letter';
import { ICityItem, IEventItem } from 'interfaces';

interface IGetEventOfDatabaseProps {
  cityName: string;
  eventName: string;
}

@Injectable()
export class MailService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async subscriptionToNews() {
    return 'subs';
  }

  async registerToEvent(formRegister: RegisterEventDto) {
    const { name, email, cityName, eventName } = formRegister;

    const event = await this.getEventOfDatabase({ cityName, eventName });
    if (!event) throw new Error(`Event not found`);

    const link = `${process.env.CLIENT_URL}/mail/${event.city._id}/${event.id}`;

    await this.nodemailerService.sendRegistrationMail({
      to: email,
      subject: `Hello ${name}! Welcome to Events App`,
      html: registerLetter(link, event),
    });

    return formRegister;
  }

  async getEventOfDatabase({ cityName, eventName }: IGetEventOfDatabaseProps) {
    const city: ICityItem = await this.cityModel
      .findOne({
        'city.label': { $regex: new RegExp(`^${cityName}$`, 'i') },
      })
      .lean();
    if (!city) throw new Error(`City not found`);

    const event: any = city.events.find(
      (event: IEventItem) =>
        event.title.toLowerCase() === eventName.toLowerCase(),
    );
    if (!event) throw new Error(`Event not found`);
    event.city = city;

    return event;
  }
}
