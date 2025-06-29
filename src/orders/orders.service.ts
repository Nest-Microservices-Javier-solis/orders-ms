import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/pagination.dto';
import { paginationConfig } from 'src/common/paginationFun';
import { firstValueFrom } from 'rxjs';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject('NATS_SERVICE') private readonly productsClient: ClientProxy
  ) { super() }


  async onModuleInit() {
    await this.$connect();
  }
  async create(createOrderDto: CreateOrderDto) {
    try {

      const validacion: CreateOrderDto = await firstValueFrom(this.productsClient.send({ cmd: 'verify_one_product' }, createOrderDto))
      const totalAmount = validacion.items.reduce((total, item) => {
        total = total + (item.price * item.quantity);
        return total;
      }, 0)
      const totalItems = validacion.items.length

      const ordenes = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          status: 'PENDING',
          items: {
            createMany: {
              data: validacion.items.map(item => ({
                productId: item.id.toString(),
                price: item.price,
                quantity: item.quantity
              }))
            }
          }
        }
        , include: {
          items: {
            select: {
              productId: true,
              quantity: true,
              price: true
            }
          }
        }
      });

      return {
        ...ordenes, items: ordenes.items.map(product => ({
          ...product,
          name: validacion.items.find(item => +item.id === +product.productId)?.name
        }))
      };
    } catch (error) {
      throw new RpcException({ status: 404, message: error.message });

    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { page, take, status } = paginationDto
    const skip = paginationConfig(page!, take!);
    const orders = await this.order.findMany({
      take, skip, where: { status }
    });
    if (!orders.length) {
      throw new RpcException({ status: 404, message: 'No hay ordenes registradas' });
    }
    return { data: orders };
  }

  async findOne(id: string) {

    const order = await this.order.findUnique({
      where: { id }, include: {
        items: {
          select: {
            productId: true,
            quantity: true,
            price: true
          }
        }
      }
    });

    if (!order) {
      throw new RpcException({ status: 404, message: 'Orden no encontrada' });
    }
    const validacion = await firstValueFrom(this.productsClient.send({ cmd: 'verify_one_product' }, {
      items: order?.items.map(item => ({
        id: +item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    }))

    return {
      ...order, items: [...order.items.map(prod => ({
        ...prod,
        name: validacion.items.find(item => +item.id === +prod.productId)?.name
      }))]
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id)
    try {
      await this.order.update({ where: { id }, data: updateOrderDto })
    } catch (error) {
      throw new RpcException({ status: 400, message: 'Error al actualizar la orden' });
    }


    return { message: 'Orden actualizada correctamente' };
  }

}
