require("dotenv").config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { FakeAuthMiddleware } from './auth/fake-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend on port 3000
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Only needed if you use cookies/auth
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true}));

  await app.listen(3001);

}
bootstrap();
