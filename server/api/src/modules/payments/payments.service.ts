// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import Stripe from 'stripe';
// import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
// import { OrderStatus, PaymentStatus, Prisma } from 'src/generated/prisma/client';
// import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
// import { PaymentResponseDto } from './dto/payment-response.dto';

// @Injectable()
// export class PaymentsService {
//   private stripe: any;

//   constructor(private prisma: PrismaService) {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//       apiVersion: '2025-12-15.clover' as any,
//     });
//   }

//   // create payment intent
//   async createPaymentIntent(
//     userId: string,
//     createPaymentIntentDto: CreatePaymentIntentDto,
//   ): Promise<{
//     success: boolean;
//     data: { clientSecret: string; paymentId: string };
//     message: string;
//   }> {
//     const { orderId, amount, currency = 'inr' } = createPaymentIntentDto;

//     const order = await this.prisma.order.findFirst({
//       where: { id: orderId, userId },
//     });

//     if (!order) {
//       throw new NotFoundException(`Order with ID ${orderId} not found`);
//     }

//     const existingPayment = await this.prisma.payment.findFirst({
//       where: { orderId },
//     });

//     if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
//       throw new BadRequestException('payment already complted for this order');
//     }

//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency,
//       metadata: { orderId, userId },
//     });

//     const payment = await this.prisma.payment.create({
//       data: {
//         orderId,
//         userId,
//         amount,
//         currency,
//         status: PaymentStatus.PENDING,
//         paymentMethod: 'STRIPE',
//         transationId: paymentIntent.id,
//       },
//     });

//     return {
//       success: true,
//       data: {
//         clientSecret: paymentIntent.client_secret!,
//         paymentId: payment.id,
//       },
//       message: 'Payment intent created successfully',
//     };
//   }

//   // Confirm payment intent
//   async confirmPayment(
//     userId: string,
//     confirmPaymentDto: ConfirmPaymentDto,
//   ): Promise<{
//     success: boolean;
//     data: PaymentResponseDto;
//     message: string;
//   }> {
//     const { paymentIntentId, orderId } = confirmPaymentDto;

//     const payment = await this.prisma.payment.findFirst({
//       where: {
//         orderId,
//         userId,
//         transationId: paymentIntentId,
//       },
//     });

//     if (!payment) {
//       throw new NotFoundException('payment not found');
//     }

//     if (payment.status === PaymentStatus.COMPLETED) {
//       throw new BadRequestException('Payment already completed ');
//     }

//     const paymentIntent =
//       await this.stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status !== 'succeeded') {
//       throw new BadRequestException('Payment not successful');
//     }

//     const [updatedPayment] = await this.prisma.$transaction([
//       this.prisma.payment.update({
//         where: { id: payment.id },
//         data: { status: PaymentStatus.COMPLETED },
//       }),

//       this.prisma.order.update({
//         where: { id: orderId },
//         data: { status: OrderStatus.PROCESSING },
//       }),
//     ]);

//     const order = await this.prisma.order.findFirst({
//       where: {
//         id: orderId,
//       },
//     });

//     if (order?.cartId) {
//       await this.prisma.cart.update({
//         where: { id: order.cartId },
//         data: { checkedOut: true },
//       });
//     }

//     return {
//       success: true,
//       data: this.mapToPaymentResponse(updatedPayment),
//       message: 'Payment confirmed successfully',
//     };
//   }

//   // Get all payments for current user
//   async findAll(userId: string): Promise<{
//     success: boolean;
//     data: PaymentResponseDto[];
//     message: string;
//   }> {
//     const payments = await this.prisma.payment.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//     });

//     return {
//       success: true,
//       data: payments.map((payment) => this.mapToPaymentResponse(payment)),
//       message: 'Payment retrieved successfully',
//     };
//   }

//   // Get payment by ID
//   async findOne(
//     id: string,
//     userId: string,
//   ): Promise<{
//     success: boolean;
//     data: PaymentResponseDto;
//     message: string;
//   }> {
//     const payment = await this.prisma.payment.findFirst({
//       where: { id, userId },
//     });

//     if (!payment) {
//       throw new NotFoundException(`payment with ID ${id} not found`);
//     }

//     return {
//       success: true,
//       data: this.mapToPaymentResponse(payment),
//       message: 'Payment retrieved successfully',
//     };
//   }

//   // Get Payment by order ID
//   async findByOrder(
//     orderId: string,
//     userId: string,
//   ): Promise<{
//     success: boolean;
//     data: PaymentResponseDto | null;
//     message: string;
//   }> {
//     const payment = await this.prisma.payment.findFirst({
//       where: { orderId, userId },
//     });

//     return {
//       success: true,
//       data: payment ? this.mapToPaymentResponse(payment) : null,
//       message: 'Payment retrieved successfully',
//     };
//   }

//   private mapToPaymentResponse(payment: {
//     id: string;
//     orderId: string;
//     userId: string;
//     amount: Prisma.Decimal;
//     currency: string;
//     status: PaymentStatus;
//     paymentMethod: string | null;
//     transationId: string | null;
//     createdAt: Date;
//     updatedAt: Date;
//   }): PaymentResponseDto {
//     return {
//       id: payment.id,
//       orderId: payment.orderId,
//       userId: payment.userId,
//       currency: payment.currency,
//       amount: payment.amount.toNumber(),
//       status: payment.status,
//       paymentMethod: payment.paymentMethod,
//       transactionId: payment.transationId,
//       createdAt: payment.createdAt,
//       updatedAt: payment.updatedAt,
//     };
//   }
// }

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

type PaymentEntity = Prisma.PaymentGetPayload<object>;

@Injectable()
export class PaymentsService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');
  }

  // create payment intent
  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{
    success: boolean;
    data: { clientSecret: string; paymentId: string };
    message: string;
  }> {
    const { orderId, amount, currency = 'inr' } = createPaymentIntentDto;

    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed for this order');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId, userId },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod: 'STRIPE',
        transationId: paymentIntent.id,
      },
    });

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret ?? '',
        paymentId: payment.id,
      },
      message: 'Payment intent created successfully',
    };
  }

  // Confirm payment intent
  async confirmPayment(
    userId: string,
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const { paymentIntentId, orderId } = confirmPaymentDto;

    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId,
        userId,
        transationId: paymentIntentId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed');
    }

    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not successful');
    }

    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED },
      }),

      this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      }),
    ]);

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order?.cartId) {
      await this.prisma.cart.update({
        where: { id: order.cartId },
        data: { checkedOut: true },
      });
    }

    return {
      success: true,
      data: this.mapToPaymentResponse(updatedPayment),
      message: 'Payment confirmed successfully',
    };
  }

  // Get all payments for current user
  async findAll(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: payments.map((payment) => this.mapToPaymentResponse(payment)),
      message: 'Payment retrieved successfully',
    };
  }

  // Get payment by ID
  async findOne(
    id: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return {
      success: true,
      data: this.mapToPaymentResponse(payment),
      message: 'Payment retrieved successfully',
    };
  }

  // Get Payment by order ID
  async findByOrder(
    orderId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto | null;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, userId },
    });

    return {
      success: true,
      data: payment ? this.mapToPaymentResponse(payment) : null,
      message: 'Payment retrieved successfully',
    };
  }

  private mapToPaymentResponse(payment: PaymentEntity): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      currency: payment.currency,
      amount: payment.amount.toNumber(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transationId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
