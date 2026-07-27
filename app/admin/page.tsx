import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    }),
  ]);

  const cards = [
    { label: "Products", value: productCount },
    { label: "Total Orders", value: orderCount },
    { label: "Orders to Fulfill", value: pendingCount },
    { label: "Revenue", value: formatGHS(revenue._sum.total || 0) },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-xl font-bold text-brand">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
