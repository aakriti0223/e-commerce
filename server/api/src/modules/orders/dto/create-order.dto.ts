// Dto for creating order

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderItdemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({
    example: 49.99,
  })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'Price must be a valid number (e.g., 40.99)' },
  )
  @Type(() => Number)
  price!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItdemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItdemDto)
  items!: OrderItdemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
