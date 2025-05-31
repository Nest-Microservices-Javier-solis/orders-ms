import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsPositive } from "class-validator";
import { OrderStatus } from "generated/prisma";
import { OrderStatusList } from "src/orders/enum/order.enum";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    take?: number = 5
    @IsOptional()
    @IsEnum(OrderStatusList)
    status?: OrderStatus;
}