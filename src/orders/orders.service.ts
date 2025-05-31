import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/pagination.dto';
import { paginationConfig } from 'src/common/paginationFun';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async create(createOrderDto: CreateOrderDto) {

    return await this.order.create({ data: createOrderDto })
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, take, status } = paginationDto
    const skip = paginationConfig(page!, take!);
    const orders = await this.order.findMany({ take, skip, where: { status } });
    if (!orders.length) {
      throw new RpcException({ status: 404, message: 'No hay ordenes registradas' });
    }
    return { data: orders };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({ where: { id } });

    if (!order) {
      throw new RpcException({ status: 404, message: 'Orden no encontrada' });
    }
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id)
    try {
      await  this.order.update({ where: { id }, data: updateOrderDto})
    } catch (error) {
      throw new RpcException({ status: 400, message: 'Error al actualizar la orden' });
    }
    

    return { message: 'Orden actualizada correctamente' };
  }

}
