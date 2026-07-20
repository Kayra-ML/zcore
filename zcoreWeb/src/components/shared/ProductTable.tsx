import StatusBadge from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { type Product } from "@/lib/mock-data";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111111] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th className="text-left px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Ürün
              </th>
              <th className="text-left px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                SKU
              </th>
              <th className="text-right px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Satış Fiyatı
              </th>
              <th className="text-right px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Net Kâr
              </th>
              <th className="text-right px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Marj
              </th>
              <th className="text-right px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Stok
              </th>
              <th className="text-center px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Durum
              </th>
              <th className="text-right px-4 py-3.5 text-zinc-500 font-medium whitespace-nowrap">
                Min. Güvenli Fiyat
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                  i === products.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3.5">
                  <div className="font-medium text-white max-w-[200px] truncate">
                    {product.name}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-zinc-500 font-mono text-xs">
                  {product.sku}
                </td>
                <td className="px-4 py-3.5 text-right text-zinc-200 tabular-nums">
                  {formatCurrency(product.salePrice)}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  <span
                    className={
                      product.netProfit >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {formatCurrency(product.netProfit)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  <span
                    className={
                      product.margin >= 15
                        ? "text-green-400"
                        : product.margin >= 0
                        ? "text-amber-400"
                        : "text-red-400"
                    }
                  >
                    {product.margin.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  <span
                    className={
                      product.stock === 0
                        ? "text-red-400 font-semibold"
                        : product.stock <= 10
                        ? "text-amber-400"
                        : "text-zinc-300"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-zinc-400">
                  {formatCurrency(product.minSafePrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
