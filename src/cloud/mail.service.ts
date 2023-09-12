import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ISendRegistrationMailProps {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NodemailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendRegistrationMail(props: ISendRegistrationMailProps): Promise<void> {
    const { to, subject, html } = props;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: '',
      html,
    });
  }
}
