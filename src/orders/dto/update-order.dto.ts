import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from 'generated/prisma';

export class UpdateOrderDto {
  @IsNotEmpty({ message: 'El id de la orden es obligatorio' })
  id: string;
  @IsEnum(OrderStatusList, { message: 'El estado debe ser uno de los siguientes: PENDING, COMPLETED, CANCELLED' })
  status: OrderStatus = OrderStatus.PENDING
}
