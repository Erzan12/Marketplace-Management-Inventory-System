require("dotenv").config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { setupGlobalPrefix } from './common/helpers/global-prefix.helper';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cookieParser = require('cookie-parser');

  // handle cookies
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  //log manual queries
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  new PrismaClient({ adapter, log: ['query'] });

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
    // origin: ['http://localhost:3000'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Only needed if you use cookies/auth
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true}));

  setupGlobalPrefix(app);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}/api-docs`);
}
bootstrap();
