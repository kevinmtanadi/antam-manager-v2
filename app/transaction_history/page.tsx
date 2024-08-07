"use client";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { formatDate, formatRupiah } from "../helper";
import { BiSearch } from "react-icons/bi";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import { EyeIcon } from "@/icons/EyeIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import DetailTransactionModal from "./DetailTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

interface TransactionObj {
  id: string;
  createdAt: string;
  status: string;
  profit: number;
  totalPrice: number;
}

interface FetchTransactionParams {
  id: string;
  date: string;
  page: number;
  rows_per_page: number;
  status: string;
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
    status: "",
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
            status: params.status,
          },
        });
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [id, setId] = useState("");

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
      key: "status",
      label: "Status",
    },
    {
      key: "totalPrice",
      label: "Harga",
    },
    {
      key: "profit",
      label: "Profit",
    },
    {
      key: "action",
      label: "",
    },
  ];

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onOpenChange: onDetailOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const renderStatus = (status: string) => {
    switch (status) {
      case "PURCHASE":
        return (
          <Chip className="px-4" variant="flat" size="sm" color="success">
            Beli
          </Chip>
        );
      case "SALE":
        return (
          <Chip className="px-4" variant="flat" size="sm" color="danger">
            Jual
          </Chip>
        );
      default:
        return status;
    }
  };

  return (
    <div className="mt-7 w-full flex justify-center text-default-900">
      <div className="grid grid-cols-1 gap-4 w-full">
        <div className="flex w-full gap-4">
          <Table
            color="primary"
            selectionMode="single"
            aria-label="Tabel penjualan"
            topContent={
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Cari transaksi berdasarkan ID"
                    startContent={<BiSearch />}
                    value={params.id}
                    onClear={() => setParams({ ...params, id: "" })}
                    onValueChange={(e) => setParams({ ...params, id: e })}
                  />
                  <Select
                    color="primary"
                    defaultSelectedKeys={[0]}
                    className="w-36"
                    onChange={(e) =>
                      setParams({
                        ...params,
                        status: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="0" value={"0"}>
                      Semua
                    </SelectItem>
                    <SelectItem key={"PURCHASE"} value={"PURCHASE"}>
                      Beli
                    </SelectItem>
                    <SelectItem key={"SALE"} value={"SALE"}>
                      Jual
                    </SelectItem>
                  </Select>
                </div>
                <div className="flex justify-end items-center">
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
                {data && data?.totalFiltered > 0 && (
                  <Pagination
                    showControls
                    isCompact
                    total={Math.ceil(
                      data?.totalFiltered / params.rows_per_page
                    )}
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
                      {formatDate(transaction.createdAt, "dd month yyyy")}
                    </TableCell>
                    <TableCell>{renderStatus(transaction.status)}</TableCell>
                    <TableCell>
                      {formatRupiah(transaction.totalPrice)}
                    </TableCell>
                    <TableCell>{formatRupiah(transaction.profit)}</TableCell>
                    <TableCell>
                      <div className="relative flex justify-end items-center gap-2">
                        <EyeIcon
                          onClick={() => {
                            setId(transaction.id);
                            onDetailOpenChange();
                          }}
                          className="cursor-pointer text-xl text-default-500  flex-shrink-0"
                        />
                        <DeleteIcon
                          onClick={() => {
                            setId(transaction.id);
                            onDeleteOpenChange();
                          }}
                          className="cursor-pointer text-xl text-default-500  flex-shrink-0"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
      <DetailTransactionModal
        isOpen={isDetailOpen}
        onOpenChange={onDetailOpenChange}
        id={id}
      />
      <DeleteTransactionModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        id={id}
      />
    </div>
  );
};

export default TransactionHistory;
