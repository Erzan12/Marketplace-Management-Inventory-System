import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    //Plain Invoice Receipt
    @Get(':orderId')
    getInvoice(@Param('orderId', ParseIntPipe) orderId: string) {
        return this.invoiceService.generateBasicInvoice(orderId);
    }

    // //PDF Invoice Receipt
    // @Get(':orderId/pdf')
    // generatePdf(@Param('orderId') orderId: number, @Res() res: Response) {
    //     return this.invoiceService.generatePDFInvoice(+orderId, res)
    // }

    //Email Invoice Recept
    // @Get(':orderId/mail')
    // generateEmail(@Param('orderId') orderId: number) {
    //     return this.invoiceService.sendInvoicePDFEmail(+orderId)
    // }
}
