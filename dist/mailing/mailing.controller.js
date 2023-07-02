"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailingController = void 0;
const common_1 = require("@nestjs/common");
const mailing_service_1 = require("./mailing.service");
let MailingController = class MailingController {
    constructor(mailingService) {
        this.mailingService = mailingService;
    }
    sendMail() {
        this.mailingService.transporter.sendMail(this.mailingService.mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('send-mail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MailingController.prototype, "sendMail", null);
MailingController = __decorate([
    (0, common_1.Controller)('mailing'),
    __metadata("design:paramtypes", [mailing_service_1.MailingService])
], MailingController);
exports.MailingController = MailingController;
//# sourceMappingURL=mailing.controller.js.map