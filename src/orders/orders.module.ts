import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '@nestjs/microservices';
import { PrismaService } from 'src/config/prismaSettings';
import { registerNatService } from 'src/nats/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,PrismaService],
  imports:[ClientsModule.register(registerNatService())],
})
export class OrdersModule {}
