import { Post, Controller, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { RegisterEventDto } from './dto/register.event.dto';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('subscription')
  subscriptionToNews() {
    return this.mailService.subscriptionToNews();
  }

  @Post('register')
  registerToEvent(@Body() formRegister: RegisterEventDto) {
    return this.mailService.registerToEvent(formRegister);
  }
}
