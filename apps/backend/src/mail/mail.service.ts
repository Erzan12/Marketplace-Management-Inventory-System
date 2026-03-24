import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or use SMTP settings
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendInvoiceEmail(
    to: string, 
    subject: string, 
    htmlContent: string,
    pdfBuffer: Buffer,
    filename: string
  ) {
    return this.transporter.sendMail({
      from: `"Dummy Bussiness" <$process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
            filename,
            content: pdfBuffer,
            contentType:'application/pdf',
        },
      ],
    });
  } catch (error) {
    console.error('📨 Email sending failed:', error);
    throw error;
  }
}
