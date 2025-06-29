import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"


export class CreateProductDto {
    @IsNumber()
    @Type(() => Number)
    id: number
    @IsString()
    name: string
    @IsNumber()
    @IsPositive()
    price: number
    @IsNumber()
    @IsPositive()
    quantity: number



}


export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateProductDto)
    items: CreateProductDto[]


}
