import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

export interface ChangeInfo {
    from: string;
    lastMonthValue: string;
    change: string;
    amount: string;
    percentage: string;
}

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(private prisma: PrismaService) {}

    async getInventoryAnalytics() {
        const products = await this.prisma.product.findMany();

        const totalProducts = products.length;
        const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValueNumber = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        //Format current total value
        const totalValueFormatted =`₱${totalValueNumber.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

        // === Fetch last month's snapshots ==
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const snapshotKey = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1). toString().padStart(2, '0')}`;
        
        const lastMonthSnapshot = await this.prisma.inventorySnapshot.findUnique({
            where: { month: snapshotKey },
        });

        let changeInfo: ChangeInfo | null = null;

        if (lastMonthSnapshot) {
            const lastValue = lastMonthSnapshot.totalValue;
            const diff = totalValueNumber - lastValue;
            const rawPercentage = (diff / lastValue) * 100;

            changeInfo = {
                from: snapshotKey,
                lastMonthValue: `₱${lastValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                change: diff > 0 ? 'increase' : 'decrease',
                amount: `₱${Math.abs(diff).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                percentage: `${Math.abs(rawPercentage).toFixed(2)}%`,
            };
        }

        return {
            message: 'Current Inventory Overview',
            data: {
            totalProducts,
            totalUnits,
            totalValue: totalValueFormatted,
            comparison: changeInfo || 'No data for last month',
            },
        };
    }

    async getTopSellingProducts(limit = 5) {
        const bestSellers = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take:limit,
        });

        const withNames = await Promise.all(
            bestSellers.map(async (item) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                return {
                    productId: item.productId,
                    name: product?.name,
                    totalSold: item._sum.quantity,
                };
            }),
        );

        return withNames
    }

    // == Monthly Snapshot scheduler == | This will run automatically at midnight on the 1st of every month.

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async saveMonthlyInventorySnapshot() {
        const products = await this.prisma.product.findMany();
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        const now = new Date();
        const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

        await this.prisma.inventorySnapshot.upsert({
            where: { month: monthKey },
            update: { totalValue },
            create: {
                month: monthKey,
                totalValue,
            },
        });

        this.logger.log(`✅ Inventory snapshot saved for ${monthKey} with value ₱${totalValue.toFixed(2)}`);
    }

    // Automatic testing of inventory snapshot no need to be enrolled in controller or use postman
    //  for testing it will automatically retrieved data in the log when a minute pass by
    // @Cron(CronExpression.EVERY_MINUTE)
    // async testSnapshot() {
    //     this.logger.log('🧪 Testing monthly snapshot scheduler...');
    //     await this.saveMonthlyInventorySnapshot();
    // }
}
