import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(readonly mailingService: MailingService) {}
  @Get('send-mail')
  public sendMail() {
    
    this.mailingService.transporter.sendMail(this.mailingService.mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log("Email sent: " + info.response);
      }
    });
  }
}