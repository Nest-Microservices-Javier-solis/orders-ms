import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator"
import { Type } from "class-transformer"
import { OrderStatus } from "generated/prisma"
import { OrderStatusList } from "../enum/order.enum"



export class CreateOrderDto {
    @IsNumber({}, { message: 'El total debe ser numerico' })
    @Type(() => Number)
    totalAmount: number
    @IsNumber({}, { message: 'El total de articulos debe ser numerico' })
    @Type(() => Number)
    totalItems: number
    @IsEnum(OrderStatusList, { message: 'El estado debe ser uno de los siguientes: PENDING, COMPLETED, CANCELLED' })
    status: OrderStatus = OrderStatus.PENDING
    @IsBoolean()
    @IsOptional()
    paid: boolean = false


}
