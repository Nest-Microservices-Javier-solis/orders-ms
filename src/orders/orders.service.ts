import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async create(createOrderDto: CreateOrderDto) {

    return await this.order.create({ data: createOrderDto })
  }

  async findAll() {
    const orders = await this.order.findMany()
    if(!orders.length)
    {
      throw new RpcException({ status: 404, message: 'No hay ordenes registradas' });
    }
    return orders;
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({ where: { id } });

    if (!order) {
      throw new RpcException({ status: 404, message: 'Orden no encontrada' });
    }
    return order
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

}
