import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

const nodemailer = require("nodemailer");
@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
//  n = Math.floor(Math.random() * 9999)

transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "youremail",
      pass: "secretcode"
   }
});

 mailOptions = {
   from: "email",
   to: "toemail",
   subject: "Nodemailer Test",
   html:  Math.floor(Math.random() * 9000).toString()
};


}
