import "server-only";
import { prisma } from "@/lib/db";

const LOW_STOCK_THRESHOLD = 10;

export async function getDashboardStats() {
  const [totalOrders, paidOrders, pendingPayments, totalProducts, lowStockProducts] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.payment.count({ where: { status: { in: ["pending", "confirming"] } } }),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true, stock: { lte: LOW_STOCK_THRESHOLD, gt: 0 } } }),
    ]);

  return { totalOrders, paidOrders, pendingPayments, totalProducts, lowStockProducts };
}

export async function getRecentOrders(take = 5) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { payment: true },
  });
}

export async function getRecentProducts(take = 5) {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { category: true },
  });
}
