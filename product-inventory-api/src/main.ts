require("dotenv").config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { FakeAuthMiddleware } from './auth/fake-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Product Inventory Management System(PIMS)')
    .setDescription('This is the api for PIMS')
    .setVersion('V1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoint for user authentication')
    .addTag('Administrator', 'Manage and maintain the system')
    .addTag('User', 'User profile and dashboard')
    .addTag('Cart', 'User orders cart')
    .addTag('Order', 'User purchases')
    .addTag('Invoice', 'User order invoice or receipt')
    .addTag('Product', 'Endpoint for products list and availability')
    .addTag('Category', 'Endpoint for products category')
    .addTag('Analytics', 'Endpoint for sales analytics and operation metrics')
    .build();

  const documentFactory =  () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // ✅ Enable CORS for frontend on port 3000
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Only needed if you use cookies/auth
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true}));

  app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000")
    console.log("Swagger API is ruuning at http://localhost:3000/api")
  })
}
bootstrap();
