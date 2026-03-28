// src/order/order.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { UpdateOrderStatusDto } from './dto/order.dto';
import * as streamBuffers from 'stream-buffers';
import PDFDocument from 'pdfkit';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '../../shared/constants/enums.decorator';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private cartService: CartService, private mailService: MailService) {}

  //get all user orders (admin role)
  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc'},
    });
  }

  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc'},
    });
  }

  // async createOrder(userId: number, dto: CreateOrderDto) {

  //   //validate if product exist before order
  //   const productIds = dto.items.map(item => item.productId);
  //   const products = await this.prisma.product.findMany({
  //     where: { id: { in: productIds } },
  //     select: { id: true },
  //   });

  //   const existingIds = new Set(products.map(p => p.id));
  //   const invalidIds = productIds.filter(id => !existingIds.has(id));

  //   if (invalidIds.length > 0) {
  //     throw new BadRequestException(`Invalid productId(s): ${invalidIds.join(', ')}`);
  //   }
    
  //   // Create order with related items in a single transaction
  //   const order = await this.prisma.order.create({
  //     data: {
  //       userId,
  //       items: {
  //         create: dto.items.map(item => ({
  //           productId: item.productId,
  //           quantity: item.quantity,
  //           price: item.price,
  //         })),
  //       },
  //     },
  //     include: {
  //       items: true,
  //     },
  //   });

  //   return order;
  // }

  async UpdateOrderStatus(orderId: number, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    })
  }

  //check out or order item
  // async checkout(userId: number) {

  //   if (!userId) {
  //       throw new BadRequestException('User ID is missing');
  //     }

  //     const cartItems = await this.cartService.viewCart(userId);
  //     if (cartItems.length === 0) {
  //       throw new BadRequestException('Cart is empty');
  //     }
      
  //     return this.prisma.$transaction(async (tx) => {

  //     // Validate stock first
  //     for (const item of cartItems) {
  //       const product = await tx.product.findUnique({
  //         where: { id: item.productId },
  //       });

  //       if (!product) {
  //         throw new NotFoundException(`Product ID ${item.productId} not found`);
  //       }

  //       if (item.quantity > product.quantity) {
  //         throw new BadRequestException(
  //           `Not enough stock for "${product.name}". Available: ${product.quantity}`
  //         );
  //       }
  //     }

  //     // Calculate total price
  //     let total = 0;
  //     const itemsData = cartItems.map((item) => {
  //       const itemTotal = item.quantity * item.product.price;
  //       total += itemTotal;
  //       return {
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         price: item.product.price,
  //       };
  //     });

  //     const order = await this.prisma.order.create({
  //       data: {
  //         userId,
  //         total,
  //         items: {
  //           create: itemsData
  //           // .map((item) => ({
  //           //   productId: item.productId,
  //           //   quantity: item.quantity,
  //           //   price: item.product.price,
  //           // })),
  //         },
  //       },
  //       include: {
  //         items: true,
  //         user: true,
  //       },
  //     });
  //       console.log('Calculated total:', total);
  //         // Decrement product quantities
  //     for (const item of cartItems) {
  //       await tx.product.update({
  //         where: { id: item.productId },
  //         data: {
  //           quantity: { decrement: item.quantity },
  //         },
  //       });
  //     }

  //     //optional but helpful, to clear the cart after ordering
  //     await this.prisma.cartItem.deleteMany({ where: {userId} });

  //     // await this.mailService.sendInvoiceEmail(
  //     //   order.user.email,
  //     //   'Order Confirmation - Invoice',
  //     //   `<h2>Thank you for your order</h2>
  //     //   <p>Your order ID is ${order.id}</p>
  //     //   <p>Total: ₱${order.total}</p>`
  //     // );

  //     // After order is created
  //     const doc = new PDFDocument({ margin: 50 });
  //     const bufferStream = new streamBuffers.WritableStreamBuffer();

  //     doc.pipe(bufferStream);

  //     // === Optional Logo & Header ===
  //     doc.image('src/assets/logo.jpg', 50, 45, { width: 50 }); // Uncomment if you have a logo

  //     doc
  //       .font('Helvetica-Bold')
  //       .fontSize(20)
  //       .fillColor('#000000')
  //       .text('Dummy Business', 110, 57)
  //       .fontSize(10)
  //       .text('123 Business St, Metro Manila', 110, 75)
  //       .text('dummy@example.com', 110, 90)
  //       .moveDown(2);

  //     // === Invoice Info ===
  //     doc
  //       .font('Helvetica')
  //       .fontSize(12)
  //       .fillColor('black')
  //       .text(`Invoice #: ${order.id}`)
  //       .text(`Date: ${new Date().toLocaleDateString()}`)
  //       .text(`Customer Email: ${order.user.email}`)
  //       .moveDown(3);

  //     // === Items Table Header ===
  //     const itemX = 50;
  //     const qtyX = 290;
  //     const priceX = 350;
  //     const subtotalX = 450;

  //     const headerY = doc.y;

  //     doc
  //       .strokeColor('#cccccc')
  //       .lineWidth(1)
  //       .moveTo(itemX, doc.y)
  //       .lineTo(555, doc.y)
  //       .stroke()
  //       .moveDown(5);

  //     doc.font('Helvetica-Bold').fontSize(12);
  //     doc.text('Item', itemX, headerY);
  //     doc.text('Qty', qtyX, headerY);
  //     doc.text('Price', priceX, headerY);
  //     doc.text('Subtotal', subtotalX, headerY);

  //     doc.moveDown(0.5);
  //     doc.strokeColor('#eeeeee').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  //     doc.moveDown(0.3);

  //     // === Order Items ===
  //     doc.font('Helvetica').fontSize(12);

  //     order.items.forEach((item) => {
  //       const subtotal = item.quantity * item.price;
  //       const currentY = doc.y;

  //       doc.text(`Product ID #${item.productId}`, itemX, currentY);
  //       doc.text(`${item.quantity}`, qtyX, currentY);
  //       doc.text(`PHP${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, priceX, currentY);
  //       doc.text(`PHP${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtotalX, currentY);

  //       doc.moveDown(0.5);
  //     });

  //     // === Total Line ===
  //     doc.moveDown(1);
  //     doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  //     doc.moveDown(0.5);

  //     doc
  //       .font('Helvetica-Bold')
  //       .fontSize(12)
  //       .text(`Total: PHP${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtotalX, doc.y);

  //     // === Footer ===
  //     doc.moveDown(3);
  //     doc
  //       .fontSize(10)
  //       .fillColor('gray')
  //       .text('Thank you for your purchase!', { align: 'center' })
  //       .moveDown(0.5)
  //       .fillColor('black')
  //       .font('Helvetica-Bold')
  //       .text('If you have questions, contact', { align: 'center' })
  //       .font('Helvetica')
  //       .text('billing@dummybiz.com', { align: 'center' });

  //     doc.end();
  //     await new Promise((resolve) => doc.on('end', resolve));

  //     const pdfBuffer = bufferStream.getContents() as Buffer;

  //     if (!pdfBuffer) {
  //       throw new Error('❌ Failed to generate PDF buffer for invoice.');
  //     }

  //     // === Email HTML content ===
  //     const htmlContent = `
  //       <div style="font-family: Arial, sans-serif; padding: 16px;">
  //         <h2 style="color: #2b2e4a;">Thank you for your order!</h2>
  //         <p>Hi ${order.user.email},</p>
  //         <p>We appreciate your purchase. Please find your invoice attached below.</p>
  //         <hr />
  //         <p><strong>Order ID:</strong> ${order.id}</p>
  //         <p><strong>Total:</strong> ₱${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
  //         <p>If you have any questions, feel free to reply to this email.</p>
  //         <br />
  //         <p>Best regards,<br><strong>Dummy Business</strong></p>
  //       </div>
  //     `;

  //     await this.mailService.sendInvoiceEmail(
  //       order.user.email,
  //       'Your Invoice from Dummy Business',
  //       htmlContent,
  //       pdfBuffer,
  //       `invoice-${order.id}.pdf`
  //     );

  //     console.log('✅ Email sent (or attempted)');
  //     return order;
  //   });
  // }

  async checkout(userId: number) {

    if (!userId) {
        throw new BadRequestException('User ID is missing');
      }

    const cartItems = await this.cartService.viewCart(userId);
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    
    return this.prisma.$transaction(async (tx) => {

    // Validate stock first
    for (const item of cartItems) {
      const product = await tx.inventory.findUnique({
        where: { id: item.productId },
        include: { product: { include: { store: true } } },
      });

      if (!product) {
        throw new NotFoundException(`Product ID ${item.productId} not found`);
      }

      if (item.quantity > product.quantity) {
        throw new BadRequestException(
          `Not enough stock for "${product.product.name}". Available: ${product.quantity}`
        );
      }
    }

      // Calculate totals
    let subTotal = new Prisma.Decimal(0);
    const itemsData = cartItems.map(item => {
      const priceDecimal = new Prisma.Decimal(item.product.price);
      const lineTotal = priceDecimal.mul(item.quantity);
      subTotal = subTotal.add(lineTotal);

      return {
        quantity: item.quantity,
        price: priceDecimal,
        product: { connect: { id: item.productId } },
      };
    });

    const taxRate = new Prisma.Decimal(0.12);
    const tax = subTotal.mul(taxRate);
    const total = subTotal.add(tax);

    const storeId = cartItems[0].product.storeId;

    type OrderWithUserAndItems = Prisma.OrderGetPayload<{
      include: { user: true; store: true; items: { include: { product: true } } };
    }>;

    const order: OrderWithUserAndItems = await tx.order.create({
      data: {
        userId,
        storeId,
        total, // keep as Decimal
        items: { create: itemsData },
      },
      include: {
        items: { include: { product: true } },
        user: true,
        store: true,
      },
    });

      // fetch with relations
      // const order = await tx.order.findUnique({
      //   where: { id: orderCreated.id },
      //   include: {
      //     user: true,
      //     items: { include: { product: true } },
      //   },
      // });
      console.log('Calculated total:', total);
      // Decrement product quantities
      for (const item of cartItems) {
        await tx.inventory.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      //optional but helpful, to clear the cart after ordering
      await this.prisma.cartItem.deleteMany({ where: {userId} });

      // After order is created
      const doc = new PDFDocument({ margin: 50 });
      const bufferStream = new streamBuffers.WritableStreamBuffer();
      doc.pipe(bufferStream);

      // === Logo & Header ===
      doc.image('src/assets/pictures/logo.jpg', 50, 45, { width: 50 }); // Optional

      doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('#000000')
        .text('Dummy Business', 110, 57)
        .fontSize(10)
        .text('123 Business St, Metro Manila', 110, 75)
        .text('dummy@example.com', 110, 90)
        .moveDown(2);

      // === Invoice Info ===
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('black')
        .text(`Invoice #: ${order?.user.id}`)
        .text(`Date: ${new Date().toLocaleDateString()}`)
        .text(`Customer Email: ${order?.user.email}`)
        .moveDown(2);

      // === Table Column Layout ===
      const itemX = 50;
      const itemWidth = 220;
      const qtyX = 250;
      const qtyWidth = 50;
      const priceX = 320;
      const priceWidth = 100;
      const subtotalX = 450;
      const subtotalWidth = 100;

      // === Line ABOVE Table Header ===
      doc.moveDown(1);
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(itemX, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(0.5);

      // === Table Header ===
      const headerY = doc.y;
      doc.font('Helvetica-Bold').fontSize(12);

      doc.text('Item', itemX, headerY, { width: itemWidth, align: 'center' }); // LEFT aligned
      doc.text('Qty', qtyX, headerY, { width: qtyWidth });
      doc.text('Price', priceX, headerY, { width: priceWidth, align: 'center' });
      doc.text('Subtotal', subtotalX, headerY, { width: subtotalWidth, align: 'center' });

      // === Line BELOW Table Header ===
      doc.moveDown(0.3);
      doc
        .strokeColor('#eeeeee')
        .lineWidth(1)
        .moveTo(itemX, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(0.3);

      doc.font('Helvetica').fontSize(12);

      order?.items.forEach((item) => {
        const y = doc.y; // Capture current Y before writing the row
        const subtotal = item.quantity * item.price.toNumber();

        // Draw the row's text
        doc.text(item.product?.name ?? `Product ID #${item.productId}`, itemX, y, { //added a product Id # fallback incase product name is empty
          width: itemWidth,
          align: 'left', // Make sure this stays left-aligned
        });
        doc.text(`${item.quantity}`, qtyX, y, {
          width: qtyWidth,
        });

        // Manually type PHP since Peso sign display +- in the invoice | to be fixed in the future
        doc.text(`Php${item.price.toLocaleString()}`, priceX, y, { 
          width: priceWidth,
          align: 'center',
        });
        doc.text(`Php${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtotalX, y, {
          width: subtotalWidth,
          align: 'center',
        });

        // 🔽 Add a horizontal line after this row
        const lineY = doc.y + 5; // Optional spacing before line
        doc.strokeColor('#cccccc').lineWidth(1)
          .moveTo(itemX, lineY)
          .lineTo(550, lineY)
          .stroke();

        doc.moveDown(1); // Adds spacing before the next row
      });

      // === Total Line ===
      doc.moveDown(0.5);
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(qtyX, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(0.5);

      // doc
      //   .font('Helvetica-Bold')
      //   .fontSize(12)

      //   .moveDown(0.5)
      //   .text(`Tax (12%): Php${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtotalX, doc.y, {
      //     width: subtotalWidth,
      //   })
      //   .moveDown(0.5)
      //   .text(`Total: Php${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, subtotalX, doc.y, {
      //     width: subtotalWidth,
      //   });

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .moveDown(0.5)
        .text(`Tax (12%): Php${tax.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}`, {
          width: subtotalWidth,
        })
        .moveDown(0.5)
        .text(`Total: Php${total.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}`, {
          width: subtotalWidth,
        });

      // === Footer ===
      doc.moveDown(3);
      doc
        .fontSize(10)
        .fillColor('gray')
        .text('Thank you for your purchase!', { align: 'center' })
        .moveDown(0.5)
        .fillColor('black')
        .font('Helvetica-Bold')
        .text('If you have questions, contact', { align: 'center' })
        .font('Helvetica')
        .text('billing@dummybiz.com', { align: 'center' });

      doc.end();
      await new Promise((resolve) => doc.on('end', resolve));

      const pdfBuffer = bufferStream.getContents() as Buffer;

      if (!pdfBuffer) {
        throw new Error('❌ Failed to generate PDF buffer for invoice.');
      }

      // === Email HTML content ===
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: #2b2e4a;">Thank you for your order!</h2>
          <p>Hi ${order?.user.email},</p>
          <p>We appreciate your purchase. Please find your invoice attached below.</p>
          <hr />
          <p><strong>Order ID:</strong> ${order?.id}</p>
          <p><strong>Subtotal:</strong> ₱${subTotal.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><strong>Tax (12%):</strong> ₱${tax.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><strong>Total:</strong> ₱${total.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br />
          <p>Best regards,<br><strong>Dummy Business</strong></p>
        </div>
      `;

      await this.mailService.sendInvoiceEmail(
        order.user.email,
        'Your Invoice from Dummy Business',
        htmlContent,
        pdfBuffer,
        `invoice-${order.id}.pdf`
      );

      console.log('✅ Email sent (or attempted)');
      return order;
    });
  }

  //get users orders
  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //getOrderhistoryByProduct (User)
  async getOrderHistoryByProduct(productId: number) {
    return this.prisma.orderItem.findMany({
      where: { productId },
      include: {
        order: {
          select: {
            id:true,
            user: { select: { id: true, email: true } },
            createdAt: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { 
        order: {
          createdAt: 'desc', // sort by the order.createAt
        },
      },
    });
  }

  async getSalesTrends(period: 'day' | 'month' = 'day') {

    const format = period === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd';

    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
       to_char("createdAt", '${format}') AS "date",
        SUM(total) as "totalSales",
        COUNT(*) as "ordersCount"
      FROM "Order"
      GROUP BY "date"
      ORDER BY "date" ASC
    `);

    return results.map((row) => ({
      date: row.date,
      totalSales: Number(row.totalSales ?? 0),
      ordersCount: Number(row.ordersCount ?? 0),
    }));
  }
}
