import { MailingService } from './mailing.service';
export declare class MailingController {
    readonly mailingService: MailingService;
    constructor(mailingService: MailingService);
    sendMail(): void;
}
