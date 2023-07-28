import { Post, Controller } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('subscription')
  subscription() {
    return null;
  }

  @Post('register')
  registerToEvent() {
    return null;
  }
}
