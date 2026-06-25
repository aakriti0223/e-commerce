// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { Cart, CartItem, Product } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AddToCartDto } from './dto/add-to-cart.dto';
// import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';
// import { UpdateCartItemDto } from './dto/update-cart-item.dto';

// @Injectable()
// export class CartsService {
//   constructor(private prisma: PrismaService) {}

//   // Get current user cart
//   async findMyCart(userId: string): Promise<CartApiResponseDto> {
//     const cart = await this.getOrCreateCart(userId);

//     return this.wrap(cart, 'Cart retrieved successfully');
//   }

//   // Add item to cart
//   async addItem(
//     userId: string,
//     addToCartDto: AddToCartDto,
//   ): Promise<CartApiResponseDto> {
//     const { productId, quantity } = addToCartDto;

//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       throw new NotFoundException(`Product with ID ${productId} not found`);
//     }

//     if (!product.isActive) {
//       throw new BadRequestException('Product is not active');
//     }

//     if (product.stock < quantity) {
//       throw new BadRequestException(
//         `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
//       );
//     }

//     const cart = await this.getOrCreateCart(userId);

//     const existingItem = await this.prisma.cartItem.findFirst({
//       where: {
//         cartId: cart.id,
//         productId,
//       },
//     });

//     if (existingItem) {
//       const newQuantity = existingItem.quantity + quantity;

//       if (product.stock < newQuantity) {
//         throw new BadRequestException(
//           `Insufficient stock. Available: ${product.stock}, Requested: ${newQuantity}`,
//         );
//       }

//       await this.prisma.cartItem.update({
//         where: { id: existingItem.id },
//         data: {
//           quantity: newQuantity,
//         },
//       });
//     } else {
//       await this.prisma.cartItem.create({
//         data: {
//           cartId: cart.id,
//           productId,
//           quantity,
//         },
//       });
//     }

//     const updatedCart = await this.getOrCreateCart(userId);

//     return this.wrap(updatedCart, 'Item added to cart successfully');
//   }

//   // Update cart item quantity
//   async updateItem(
//     userId: string,
//     itemId: string,
//     updateCartItemDto: UpdateCartItemDto,
//   ): Promise<CartApiResponseDto> {
//     const { quantity } = updateCartItemDto;

//     const cart = await this.getOrCreateCart(userId);

//     const item = await this.prisma.cartItem.findFirst({
//       where: {
//         id: itemId,
//         cartId: cart.id,
//       },
//       include: {
//         product: true,
//       },
//     });

//     if (!item) {
//       throw new NotFoundException(`Cart item with ID ${itemId} not found`);
//     }

//     if (item.product.stock < quantity) {
//       throw new BadRequestException(
//         `Insufficient stock. Available: ${item.product.stock}, Requested: ${quantity}`,
//       );
//     }

//     await this.prisma.cartItem.update({
//       where: { id: itemId },
//       data: { quantity },
//     });

//     const updatedCart = await this.getOrCreateCart(userId);

//     return this.wrap(updatedCart, 'Cart item updated successfully');
//   }

//   // Remove item from cart
//   async removeItem(
//     userId: string,
//     itemId: string,
//   ): Promise<CartApiResponseDto> {
//     const cart = await this.getOrCreateCart(userId);

//     const item = await this.prisma.cartItem.findFirst({
//       where: {
//         id: itemId,
//         cartId: cart.id,
//       },
//     });

//     if (!item) {
//       throw new NotFoundException(`Cart item with ID ${itemId} not found`);
//     }

//     await this.prisma.cartItem.delete({
//       where: { id: itemId },
//     });

//     const updatedCart = await this.getOrCreateCart(userId);

//     return this.wrap(updatedCart, 'Cart item removed successfully');
//   }

//   // Clear cart
//   async clearCart(userId: string): Promise<CartApiResponseDto> {
//     const cart = await this.getOrCreateCart(userId);

//     await this.prisma.cartItem.deleteMany({
//       where: {
//         cartId: cart.id,
//       },
//     });

//     const updatedCart = await this.getOrCreateCart(userId);

//     return this.wrap(updatedCart, 'Cart cleared successfully');
//   }

//   private async getOrCreateCart(userId: string): Promise<
//     Cart & {
//       cartItems: (CartItem & { product: Product })[];
//     }
//   > {
//     let cart = await this.prisma.cart.findFirst({
//       where: {
//         userId,
//         checkedOut: false,
//       },
//       include: {
//         cartItems: {
//           include: {
//             product: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     if (!cart) {
//       cart = await this.prisma.cart.create({
//         data: {
//           userId,
//           checkedOut: false,
//         },
//         include: {
//           cartItems: {
//             include: {
//               product: true,
//             },
//           },
//         },
//       });
//     }

//     return cart;
//   }

//   private wrap(
//     cart: Cart & {
//       cartItems: (CartItem & { product: Product })[];
//     },
//     message: string,
//   ): CartApiResponseDto {
//     return {
//       success: true,
//       data: this.map(cart),
//       message,
//     };
//   }

//   private map(
//     cart: Cart & {
//       cartItems: (CartItem & { product: Product })[];
//     },
//   ): CartResponseDto {
//     const items = cart.cartItems.map((item) => ({
//       id: item.id,
//       productId: item.productId,
//       productName: item.product.name,
//       quantity: item.quantity,
//       price: Number(item.product.price),
//       subtotal: Number(item.product.price) * item.quantity,
//       createdAt: item.createdAt,
//       updatedAt: item.updatedAt,
//     }));

//     const total = items.reduce((sum, item) => sum + item.subtotal, 0);

//     return {
//       id: cart.id,
//       userId: cart.userId,
//       checkedOut: cart.checkedOut,
//       items,
//       total,
//       createdAt: cart.createdAt,
//       updatedAt: cart.updatedAt,
//     };
//   }
// }

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartApiResponseDto, CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        product: true;
      };
    };
  };
}>;

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // Get current user cart
  async findMyCart(userId: string): Promise<CartApiResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    return this.wrap(cart, 'Cart retrieved successfully');
  }

  // Add item to cart
  async addItem(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartApiResponseDto> {
    const { productId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stock}, Requested: ${newQuantity}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    const updatedCart = await this.getOrCreateCart(userId);

    return this.wrap(updatedCart, 'Item added to cart successfully');
  }

  // Update cart item quantity
  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartApiResponseDto> {
    const { quantity } = updateCartItemDto;

    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    if (item.product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${item.product.stock}, Requested: ${quantity}`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedCart = await this.getOrCreateCart(userId);

    return this.wrap(updatedCart, 'Cart item updated successfully');
  }

  // Remove item from cart
  async removeItem(
    userId: string,
    itemId: string,
  ): Promise<CartApiResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await this.getOrCreateCart(userId);

    return this.wrap(updatedCart, 'Cart item removed successfully');
  }

  // Clear cart
  async clearCart(userId: string): Promise<CartApiResponseDto> {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const updatedCart = await this.getOrCreateCart(userId);

    return this.wrap(updatedCart, 'Cart cleared successfully');
  }

  private async getOrCreateCart(userId: string): Promise<CartWithItems> {
    let cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        checkedOut: false,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          checkedOut: false,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  private wrap(cart: CartWithItems, message: string): CartApiResponseDto {
    return {
      success: true,
      data: this.map(cart),
      message,
    };
  }

  private map(cart: CartWithItems): CartResponseDto {
    const items = cart.cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: Number(item.product.price),
      subtotal: Number(item.product.price) * item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      checkedOut: cart.checkedOut,
      items,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
