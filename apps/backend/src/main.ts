require("dotenv").config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import cookieParser from 'cookie-parser';
// import { FakeAuthMiddleware } from './auth/fake-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001; 
  const cookieParser = require('cookie-parser');

  // handle cookies
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Marketplace Management Inventory System (ShopStack)')
    .setDescription('This is the api for ShopStack, ShopStack is a full-stack **multi-tenant marketplace platform** built with modern web technologies.')
    .setVersion('V1.0.0')
    // .addBearerAuth()
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

  //Move Swagger to /api-docs so it doesn't fight with the /api prefix
  SwaggerModule.setup('api-docs', app, documentFactory);

  // Enable CORS for frontend on ports 3000 and 3001
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Only needed if you use cookies/auth
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true}));

  // app.listen(3001, () => {
  //   console.log("Server is running at http://localhost:3001")
  //   console.log("Swagger API is ruuning at http://localhost:3001/api")
  // })

  await app.listen(port, '0.0.0.0'); // Adding '0.0.0.0' is important for Docker/Cloud environments
  console.log(`Server is running at http://0.0.0.0:${port}/api`);
  console.log(`Swagger docs at http://0.0.0.0:${port}/api-docs`);
}
bootstrap();
