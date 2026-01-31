import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';


@Injectable()
export class InvoiceService {
    constructor(private prisma: PrismaService) {}

    async generateBasicInvoice(orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException({ message: RESPONSE_MESSAGES.ORDERS.ORDER_NOT_FOUND})
        }

        //Reject invoice if order is still pending
        if (order.status === 'pending') {
            throw new BadRequestException({
            message: RESPONSE_MESSAGES.INVOICES.ORDER_PAYMENT_PENDING,
            status: 'InvoiceGenerationRejected',
            });
        }

        //Plain Invoice Receipt
        const totals = order.items.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);

        return {
            orderId: order.id,
            customerEmail: order.user.email,
            date: order.createdAt,
            items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                unitPrice: item.price,
                totatPrice: item.quantity * item.price,
            })),
            totals,
            status: order.status,
        };
    }

    // async generatePDFInvoice(orderId: number, res: Response) {
    //     const order = await this.prisma.order.findUnique({
    //         where: { id: orderId },
    //         include: {
    //             user: true,
    //             items: {
    //                 include: { product: true },
    //             },
    //         },
    //     });

    //     if (!order) {
    //         throw new NotFoundException({ message: RESPONSE_MESSAGES.ORDERS.ORDER_NOT_FOUND})
    //     }

    //     //Reject invoice if order is still pending
    //     if (order.status === 'pending') {
    //         throw new BadRequestException({
    //         message: RESPONSE_MESSAGES.INVOICES.ORDER_PAYMENT_PENDING,
    //         status: 'InvoiceGenerationRejected',
    //         });
    //     }

    //     //PDF invoice generation
    //     const doc = new PDFDocument();
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    //     doc.pipe(res);

    //     doc.fontSize(20).text('Sales Invoice/Receipt', { align: 'center'});
    //     doc.moveDown();
    //     doc.text(`Order ID: ${order.id}`);
    //     doc.text(`Customer: ${order.user.email}`);
    //     doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    //     doc.moveDown();

    //     let total = 0;

    //     order.items.forEach((item) => {
    //     const lineTotal = item.quantity * item.price;
    //     total += lineTotal;
    //     doc.text(`${item.product.name} x ${item.quantity} = PHP ${lineTotal.toFixed(2)}`);
    //     });

    //     doc.moveDown();
    //     doc.text(`Total: PHP ${total.toFixed(2)}`, { align: 'right' });

    //     doc.end();


    //     //Plain Invoice Receipt
    //     const totals = order.items.reduce((sum, item) => {
    //         return sum + item.quantity * item.price;
    //     }, 0);

    //     return {
    //         orderId: order.id,
    //         customerEmail: order.user.email,
    //         date: order.createdAt,
    //         items: order.items.map((item) => ({
    //             name: item.product.name,
    //             quantity: item.quantity,
    //             unitPrice: item.price,
    //             totatPrice: item.quantity * item.price,
    //         })),
    //         totals,
    //         status: order.status,
    //     };
    // }

    //Email & PDF Invoice
    // async sendInvoicePDFEmail(orderId: number) {
    //     const order = await this.prisma.order.findUnique({
    //         where: { id: orderId },
    //         include: {
    //             user: true,
    //             items: {
    //                 include: { product: true },
    //             },
    //         },
    //     });

    //     if (!order) {
    //         throw new NotFoundException({ message: RESPONSE_MESSAGES.ORDERS.ORDER_NOT_FOUND})
    //     }

    //     //Reject invoice if order is still pending
    //     if (order.status === 'pending') {
    //         throw new BadRequestException({
    //         message: RESPONSE_MESSAGES.INVOICES.ORDER_PAYMENT_PENDING,
    //         status: 'InvoiceGenerationRejected',
    //         });
    //     }

    //     const doc = new PDFDocument();
    //     const bufferStream = new streamBuffers.WritableStreamBuffer();

    //     doc.pipe(bufferStream);

    //     doc.fontSize(20).text('Invoice', { align: 'center' });
    //     doc.moveDown();
    //     doc.text(`Order ID: ${order.id}`);
    //     doc.text(`Customer: ${order.user.email}`);
    //     doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    //     doc.moveDown();
        
    //     let total = 0;
    //     order.items.forEach((item) => {
    //         const lineTotal = item.quantity * item.price;
    //         total += lineTotal;
    //         doc.text(`${item.product.name} x ${item.quantity} = PHP ${lineTotal.toFixed(2)}`);
    //     });

    //     doc.text(`\nTotal: PHP ${total.toFixed(2)}`, { align: 'right' });

    //     doc.end();

    //     await new Promise((resolve) => bufferStream.on('finish', resolve));

    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail', // or use SMTP
    //         auth: {
    //             user: 'dummybusiness29@gmail.com',
    //             pass: 'ncor hxud yyax prje'
    //         },
    //     });

    //     const pdfBuffer = bufferStream.getContents();
    //     if (!pdfBuffer) {
    //         throw new Error('Failed to generate PDF buffer for invoice attachment.');
    //     }

    //     const mailOptions = {
    //         from: 'dummybusiness29@gmail.com',
    //         to: order.user.email,
    //         subject: `Invoice for Order #${order.id}`,
    //         text: 'Attached here is your invoice.',
    //         attachments: [
    //             {
    //                 filename: `invoice-${order.id}.pdf`,
    //                 content: pdfBuffer,
    //             },
    //         ],
    //     };

    //     await transporter.sendMail(mailOptions);
    // }
}
