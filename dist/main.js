"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("@nestjs/common/pipes/validation.pipe");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.use(session({
        secret: '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',
        resave: false,
        saveUninitialized: false,
    }));
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true
    });
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe({
        whitelist: true,
    }));
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map