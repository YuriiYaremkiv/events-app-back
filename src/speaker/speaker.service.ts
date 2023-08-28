import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from '../schema/city.schema';
import { CloudService } from '../cloud/cloud.service';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IEventItem } from 'interfaces';

@Injectable()
export class SpeakerService {
  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly cloudService: CloudService,
  ) {}

  async getSpeakers({ cityId, eventId, reqSpeaker }) {
    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error('City not found');

    const event = city.events.find((event) => event.id === eventId);
    if (!event) throw new Error('Event not found');

    const speakers = event.speakers;
    const totalSpeakers = speakers.length;

    return { speakers, totalSpeakers };
  }

  async addSpeaker({ cityId, eventId, reqSpeaker, file, newSpeaker }) {
    const id = uuidv4();
    const imagePath = file ? await this.cloudService.addFileCloud(file) : '';

    const createdSpeaker = { ...newSpeaker, id, imagePath };

    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error('City not found');

    const event = city.events.find((event) => event.id === eventId);
    if (!event) throw new Error('Event not found');

    event.speakers.push(createdSpeaker);
    city.markModified('events');
    await city.save();

    const response = await this.getSpeakers({ cityId, eventId, reqSpeaker });
    return response;
  }

  async updateSpeaker({ cityId, eventId, updatedSpeaker, file }) {
    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error('City not found');

    const event = city.events.find((event) => event.id === eventId);
    if (!event) throw new Error('Event not found');

    const speaker = event.speakers.find(
      (speaker: any) => speaker.id === updatedSpeaker.id,
    );
    if (!speaker) throw new Error('Speaker not found');
    let imagePath = speaker.imagePath || '';

    if (file) {
      if (speaker.imagePath) {
        await this.cloudService.deleteFileCloud(speaker.imagePath);
      }
      imagePath = await this.cloudService.addFileCloud(file);
    }

    const newSpeaker = {
      ...speaker,
      ...updatedSpeaker,
      imagePath,
    };

    event.speakers = event.speakers.map((speaker: any) => {
      if (speaker.id === updatedSpeaker.id) return newSpeaker;
      return speaker;
    });
    city.markModified('events');
    await city.save();

    return newSpeaker;
  }

  async deleteSpeaker({ cityId, eventId, speakerId, reqSpeaker }) {
    const city = await this.cityModel.findById(cityId);
    if (!city) throw new Error('City not found');

    const event = city.events.find((event) => event.id === eventId);
    if (!event) throw new Error('Event not found');

    const speaker = event.speakers.find(
      (speaker: any) => speaker.id === speakerId,
    );

    if (speaker.imagePath) {
      await this.cloudService.deleteFileCloud(speaker.imagePath);
    }

    event.speakers = event.speakers.filter(
      (speaker: any) => speaker.id !== speakerId,
    );
    city.markModified('events');
    await city.save();

    const response = await this.getSpeakers({ cityId, eventId, reqSpeaker });
    return response;
  }
}
