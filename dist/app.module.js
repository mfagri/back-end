"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const passport_1 = require("@nestjs/passport");
const fortytwo_strategy_1 = require("./auth/fortytwo.strategy");
const config_1 = require("@nestjs/config");
const serilizer_1 = require("./auth/serilizer");
const user_module_1 = require("./user/user.module");
const token_sever_1 = require("./auth/token.sever");
const messages_module_1 = require("./messages/messages.module");
const rooms_module_1 = require("./rooms/rooms.module");
const mailing_module_1 = require("./mailing/mailing.module");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const mailer_1 = require("@nestjs-modules/mailer");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            passport_1.PassportModule.register({ defaultStrategy: "42" }),
            passport_1.PassportModule,
            user_module_1.userModule,
            messages_module_1.MessagesModule,
            rooms_module_1.RoomsModule,
            mailing_module_1.MailingModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mailer_1.MailerModule.forRoot({
                transport: 'smtps://user@domain.com:pass@smtp.domain.com',
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, fortytwo_strategy_1.Strategy42, serilizer_1.Serializer, token_sever_1.TokenService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map