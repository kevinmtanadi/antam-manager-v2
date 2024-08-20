"use client";

import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";
import { formatRupiah } from "./helper";

export default function Home() {
  const { data: profit, isLoading: isLoadingProfit } = useQuery({
    queryKey: ["dashboard", "profit"],
    queryFn: async () => {
      const res = await axios.get("/api/dashboard/profit");
      return res.data;
    },
  });

  const { data: total_stock, isLoading: isLoadingStock } = useQuery({
    queryKey: ["dashboard", "stock"],
    queryFn: async () => {
      const res = await axios.get("/api/dashboard/total_stock");
      return res.data;
    },
  });
  const { data: transaction, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["dashboard", "transaction"],
    queryFn: async () => {
      const res = await axios.get("/api/dashboard/total_transaction");
      return res.data;
    },
  });

  return (
    <div className="mt-10 flex flex-col justify-center text-default-900">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="mt-10 grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card>
          <CardBody>
            <div className="flex gap-2 items-center">
              <Link
                href="/transaction_history"
                className="p-1 rounded-lg bg-gray-200 scale-90 hover:scale-100 transition-all"
              >
                <GrTransaction className="text-default-500" />
              </Link>
              <p>Transaksi</p>
            </div>
            <div className="flex flex-col mt-4">
              <p className="text-sm text-default-500">Jumlah transaksi</p>
              {isLoadingTransaction ? (
                <Skeleton className="w-32 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {transaction && transaction.value}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-2 items-center">
              <Link
                href="/transaction_history"
                className="p-1 rounded-lg bg-gray-200 scale-90 hover:scale-100 transition-all"
              >
                <GrTransaction className="text-default-500" />
              </Link>
              <p>Profit</p>
            </div>
            <div className="flex flex-col mt-4">
              <p className="text-sm text-default-500">Jumlah profit</p>
              {isLoadingProfit ? (
                <Skeleton className="w-32 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {profit && formatRupiah(profit.value)}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex gap-2 items-center">
              <Link
                href="/products"
                className="p-1 rounded-lg bg-gray-200 scale-90 hover:scale-100 transition-all"
              >
                <GrTransaction className="text-default-500" />
              </Link>
              <p>Stok</p>
            </div>
            <div className="flex flex-col mt-4">
              <p className="text-sm text-default-500">Jumlah nilai stok</p>
              {isLoadingStock ? (
                <Skeleton className="w-32 h-7" />
              ) : (
                <p className="text-xl font-bold">
                  {total_stock && formatRupiah(total_stock.value)}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
