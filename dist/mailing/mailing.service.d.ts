import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
export declare class MailingService {
    private readonly configService;
    private readonly mailerService;
    constructor(configService: ConfigService, mailerService: MailerService);
    transporter: any;
    mailOptions: {
        from: string;
        to: string;
        subject: string;
        html: string;
    };
}
