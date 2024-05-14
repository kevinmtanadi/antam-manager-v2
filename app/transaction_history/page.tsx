"use client";

import {
  DatePicker,
  getKeyValue,
  Input,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDate, formatRupiah } from "../helper";
import { BiSearch } from "react-icons/bi";
import { parseDate } from "@internationalized/date";

interface TransactionObj {
  id: string;
  createdAt: string;
  totalPurchase: number;
  totalSale: number;
}

interface FetchTransactionParams {
  id: string;
  date: string;
  page: number;
  rows_per_page: number;
}

interface FetchTransactionData {
  transactions: TransactionObj[];
  totalItems: number;
  totalFiltered: number;
}

const TransactionHistory = () => {
  // PAGINATION
  const [params, setParams] = useState<FetchTransactionParams>({
    id: "",
    date: "",
    page: 1,
    rows_per_page: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      try {
        const res = await axios.get<FetchTransactionData>("/api/transaction", {
          params: {
            id: params.id,
            date: params.date,
            page: params.page,
            rows_per_page: params.rows_per_page,
          },
        });
        return res.data;
      } catch (error) {
        alert(error);
      }
    },
  });

  const headers = [
    {
      key: "id",
      label: "ID Transaksi",
    },
    {
      key: "createdAt",
      label: "Tanggal Transaksi",
    },
    {
      key: "totalPurchase",
      label: "Pembelian",
    },
    {
      key: "totalSale",
      label: "Penjualan",
    },
    {
      key: "action",
      label: "",
    },
  ];

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="mt-7 w-full flex justify-center">
      <div className="grid grid-cols-1 gap-4 w-full">
        <div className="flex w-full gap-4">
          <Table
            color="primary"
            selectionMode="single"
            aria-label="Tabel penjualan"
            topContent={
              <div className="flex flex-col gap-4">
                <div className="flex justice-between gap-3 items-end">
                  <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Cari transaksi berdasarkan ID"
                    startContent={<BiSearch />}
                    value={params.id}
                    onClear={() => setParams({ ...params, id: "" })}
                    onValueChange={(e) => setParams({ ...params, id: e })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-400 text-small">
                    Menampilkan {(params.page - 1) * params.rows_per_page + 1} -{" "}
                    {Math.min(
                      data?.totalFiltered || 0,
                      params.page * params.rows_per_page
                    )}{" "}
                    dari {data?.totalFiltered}
                  </span>
                  <label className="flex items-center text-default-400 text-small">
                    <span className="mr-2">Rows per page:</span>
                    <select
                      value={params.rows_per_page}
                      className="bg-transparent outline-none text-default-400 text-small"
                      onChange={(e) =>
                        setParams({ ...params, rows_per_page: +e.target.value })
                      }
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </label>
                </div>
              </div>
            }
            bottomContent={
              <div className="w-full flex justify-end">
                {data?.totalItems && (
                  <Pagination
                    isCompact
                    total={Math.ceil(data?.totalItems / params.rows_per_page)}
                    page={params.page}
                    onChange={(page) => setParams({ ...params, page })}
                  />
                )}
              </div>
            }
          >
            <TableHeader columns={headers}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            {isLoading ? (
              <TableBody>
                {skeletons.map((skeleton) => (
                  <TableRow key={skeleton}>
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : data?.transactions ? (
              <TableBody items={data.transactions}>
                {data.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      {formatDate(
                        transaction.createdAt,
                        "dd month yyyy HH:MM:SS"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(transaction.totalPurchase)}
                    </TableCell>
                    <TableCell>{formatRupiah(transaction.totalSale)}</TableCell>
                    <TableCell>Detail</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
