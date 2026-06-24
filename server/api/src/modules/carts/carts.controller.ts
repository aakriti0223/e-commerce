import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartApiResponseDto } from './dto/cart-response.dto';

@ApiTags('carts')
@ApiBearerAuth('JWT-auth')
@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Get current user cart
  @Get()
  @ApiOperation({
    summary: 'Get current user cart',
  })
  @ApiOkResponse({
    description: 'Cart retrieved successfully',
    type: CartApiResponseDto,
  })
  async findMyCart(@GetUser('id') userId: string) {
    return await this.cartsService.findMyCart(userId);
  }

  // Add item to cart
  @Post('items')
  @ApiOperation({
    summary: 'Add item to cart',
  })
  @ApiBody({
    type: AddToCartDto,
  })
  @ApiCreatedResponse({
    description: 'Item added to cart successfully',
    type: CartApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or insufficient stock',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async addItem(
    @GetUser('id') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return await this.cartsService.addItem(userId, addToCartDto);
  }

  // Update cart item
  @Patch('items/:itemId')
  @ApiOperation({
    summary: 'Update cart item quantity',
  })
  @ApiParam({
    name: 'itemId',
    description: 'Cart item ID',
  })
  @ApiBody({
    type: UpdateCartItemDto,
  })
  @ApiOkResponse({
    description: 'Cart item updated successfully',
    type: CartApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart item not found',
  })
  async updateItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return await this.cartsService.updateItem(
      userId,
      itemId,
      updateCartItemDto,
    );
  }

  // Remove cart item
  @Delete('items/:itemId')
  @ApiOperation({
    summary: 'Remove item from cart',
  })
  @ApiParam({
    name: 'itemId',
    description: 'Cart item ID',
  })
  @ApiOkResponse({
    description: 'Cart item removed successfully',
    type: CartApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cart item not found',
  })
  async removeItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.cartsService.removeItem(userId, itemId);
  }

  // Clear cart
  @Delete('clear')
  @ApiOperation({
    summary: 'Clear cart',
  })
  @ApiOkResponse({
    description: 'Cart cleared successfully',
    type: CartApiResponseDto,
  })
  async clearCart(@GetUser('id') userId: string) {
    return await this.cartsService.clearCart(userId);
  }
}
