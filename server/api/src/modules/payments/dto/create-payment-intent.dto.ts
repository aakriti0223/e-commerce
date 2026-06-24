import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @ApiPropertyOptional({
    example: 'inr',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'inr';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
