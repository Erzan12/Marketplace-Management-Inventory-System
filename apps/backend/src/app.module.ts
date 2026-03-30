import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// Guards
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/roles.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';

// Modules
import { AdministratorModule } from './modules/administrator/administrator.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './modules/mail/mail.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductModule } from './modules/product/product.module';

// Services
import { PrismaService } from './prisma/prisma.service';
import { InvoiceService } from './modules/invoice/invoice.service';
import { MailService } from './modules/mail/mail.service';
import { UserService } from './modules/user/user.service';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { JwtService } from '@nestjs/jwt';

// Controllers
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [ 
            AdministratorModule,
            ProductModule,
            CategoryModule,
            PrismaModule, 
            AuthModule, 
            OrderModule, 
            CartModule,  
            ScheduleModule.forRoot(),
            ConfigModule.forRoot({isGlobal: true, // makes config available everywhere
            }), InvoiceModule, MailModule, AnalyticsModule, UserModule
          ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    PrismaService, InvoiceService, MailService, AnalyticsService, UserService, JwtService],
  controllers: [AnalyticsController, UserController],
})
export class AppModule {}
