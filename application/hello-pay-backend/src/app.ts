import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/http-exception.filter';

import { AuthService } from './services/auth.service';
import { Users } from './models/Users';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './repositories/users.repository';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { authenticationController } from './controllers/authentication.controller';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { Suppliers } from './models/Suppliers';
import { SuppliersService } from './services/suppliers.service';
import { Categories } from './models/Categories';
import { CategoriesService } from './services/categories.service';
import { Products } from './models/Products';
import { ProductsService } from './services/products.service';
import { Orders } from './models/Orders';
import { OrdersService } from './services/orders.service';
import { Payments } from './models/Payments';
import { PaymentsService } from './services/payments.service';
import { PaymentPlans } from './models/PaymentPlans';
import { PaymentPlansService } from './services/payment-plans.service';
import { DeliveriesService } from './services/deliveries.service';
import { Deliveries } from './models/Deliveries';
import { suppliersController } from './controllers/suppliers.controllers';
import { categoriesController } from './controllers/categories.controller';
import { produitsController } from './controllers/produits.controller';
import { ordorsController } from './controllers/orders.controller';
import { OrderItemsRepository } from './repositories/order-items.repository';
import { OrderItems } from './models/OrderItems';
import { paymentPlanController } from './controllers/plan-payments.controller';
import { PaymentPlansRepository } from './repositories/payment-plans.repository';
import { OrderPaymentPlan } from './models/OrderPaymentPlan';
import { OrderPaymentPlanRepository } from './repositories/order-payment-plan.repository';
import { InstallmentsRepository } from './repositories/installments.repository';
import { Installments } from './models/Installments';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsRepository } from './repositories/payments.repository';
import { DeliveriesController } from './controllers/deliveries.controllers';
import { DeliveriesRepository } from './repositories/deliveries.repository';
import { ProviderPaymentsService } from './services/provider-payments.service';
import { OrdersRepository } from './repositories/orders.repository';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()), 
    JwtModule.register({
    secret: process.env.JWT_SECRET||"uLVJX2ytIiU3FPV7FXa+okVAi1XWnim7d2CCU1h/e1c=",
    signOptions: { expiresIn: '18000s' },
  }),

  TypeOrmModule.forFeature([Installments,Deliveries,PaymentPlans,Payments,Users,Suppliers,Categories,Products,Orders,OrderItems,OrderPaymentPlan])],
  controllers: [DeliveriesController,PaymentsController,paymentPlanController,ordorsController,produitsController,categoriesController,authenticationController,suppliersController],
  providers: [ OrdersRepository,DeliveriesRepository,ProviderPaymentsService,PaymentsRepository,InstallmentsRepository,OrderPaymentPlanRepository,PaymentPlansRepository,DeliveriesService,PaymentPlansService,PaymentsService,OrdersService,JwtAuthGuard,JwtStrategy,AuthService,UsersRepository,SuppliersService,CategoriesService,ProductsService,OrderItemsRepository, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {     

  }
}



