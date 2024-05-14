"use client";

import NumberInput from "@/component/NumberInput";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { PlusIcon } from "@/icons/PlusIcon";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import {
  DatePicker,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  DateValue,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { formatDate, formatRupiah } from "../helper";

import "react-toastify/dist/ReactToastify.css";

interface SaleItem {
  stockId: string;
  product?: product;
  cost: number;
  price: number;
  isLoading?: boolean;
}

interface product {
  id: string;
  name: string;
  weight: string;
}

interface PostTransaction {
  createdAt: string;
  status: string;
  items: {
    productId: string;
    stockId: string;
    price: number;
  }[];
}

const Sales = () => {
  const today = new Date().toISOString();
  const [date, setDate] = React.useState<DateValue>(
    parseDate(formatDate(today, "yyyy-mm-dd"))
  );
  const [items, setItems] = useState<SaleItem[]>([
    {
      stockId: "",
      product: undefined,
      cost: 0,
      price: 0,
    },
  ]);

  const addEmptyItem = () => {
    setItems([
      ...items,
      {
        stockId: "",
        cost: 0,
        product: undefined,
        price: 0,
      },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const findItem = async (idx: number) => {
    const stockId = items[idx].stockId;

    const alreadyExist = !items.some((item) => item.stockId === stockId);
    if (alreadyExist) {
      toast.error("Stok sudah ada dalam list");
    } else {
      setItems([
        ...items.slice(0, idx),
        {
          ...items[idx],
          isLoading: true,
        },
        ...items.slice(idx + 1),
      ]);

      await axios
        .get("/api/product/stock/" + stockId)
        .then((res) => {
          const data = res.data.stock;
          console.log(data);

          setItems([
            ...items.slice(0, idx),
            {
              ...items[idx],
              product: data.product,
              isLoading: false,
              cost: data.cost,
            },
            ...items.slice(idx + 1),
          ]);
        })
        .catch((err) => {
          toast.error("Stok dengan ID " + stockId + " tidak ditemukan");
          setItems([
            ...items.slice(0, idx),
            {
              ...items[idx],
              isLoading: false,
            },
            ...items.slice(idx + 1),
          ]);
        });
    }
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: PostTransaction) => {
      await axios.post("/api/transaction", body);
    },
    onSuccess: () => {
      setItems([]);
    },
  });

  const handleSale = () => {
    toast.promise(
      mutateAsync({
        createdAt: date.toDate(getLocalTimeZone()).toISOString(),
        status: "SALE",
        items: items.map((item) => {
          return {
            productId: item.product?.id || "",
            stockId: item.stockId,
            price: item.price,
          };
        }),
      }),
      {
        pending: "Memproses transaksi...",
        success: "Transaksi sukses",
        error: "Transaksi gagal",
      }
    );
  };

  return (
    <div className="mt-7 min-w-[600px] flex justify-center">
      <div className="grid grid-cols-1 gap-4 w-full">
        <div className="flex w-full gap-4">
          <DatePicker
            value={date}
            onChange={setDate}
            label="Tanggal Transaksi"
          />
        </div>
        <div className="w-full grid grid-cols-1 gap-4">
          <Table
            topContent={
              <div className="w-full flex justify-end">
                <Button
                  onClick={addEmptyItem}
                  endContent={<PlusIcon fontSize={"1.5rem"} />}
                  className="text-white"
                  color="success"
                >
                  Tambah
                </Button>
              </div>
            }
            bottomContent={
              <div className="w-full flex justify-end">
                <Button
                  className="font-semibold mt-5"
                  color="primary"
                  onClick={handleSale}
                  isDisabled={
                    items.length <= 0 || !items.some((item) => item.product)
                  }
                >
                  Jual
                </Button>
              </div>
            }
            className=""
            radius="sm"
            aria-label="Tabel penjualan"
          >
            <TableHeader>
              <TableColumn>Kode Item</TableColumn>
              <TableColumn>Produk</TableColumn>
              <TableColumn>Modal</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell width={"35%"}>
                    <div className="flex gap-2 justify-between">
                      <Input
                        isDisabled={item.product ? true : false}
                        value={item.stockId}
                        onChange={(e) => {
                          setItems([
                            ...items.slice(0, idx),
                            {
                              ...item,
                              stockId: e.target.value,
                            },
                            ...items.slice(idx + 1),
                          ]);
                        }}
                      />
                      <Button
                        isDisabled={item.product ? true : false}
                        isLoading={item.isLoading}
                        color="primary"
                        className="w-15 min-w-10"
                        onClick={() => findItem(idx)}
                      >
                        <BiSearch fontSize={"1.25rem"} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell width={"25%"}>
                    <div className="flex flex-col">
                      <div className="text-sm">{item.product?.id}</div>
                      <div className="text-sm text-default-400">
                        {item.product?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell width={"20%"}>
                    <div className="flex flex-col">
                      <div className="text-sm">{formatRupiah(item.cost)}</div>
                    </div>
                  </TableCell>
                  <TableCell width={"18%"}>
                    <NumberInput
                      value={item.price}
                      onChangeValue={(price) => {
                        setItems([
                          ...items.slice(0, idx),
                          {
                            ...item,
                            price: price,
                          },
                          ...items.slice(idx + 1),
                        ]);
                      }}
                    />
                  </TableCell>
                  <TableCell width={"2%"}>
                    <div className="relative flex justify-end items-center gap-2">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                      >
                        <DeleteIcon
                          onClick={() => removeItem(idx)}
                          className="text-lg text-red-600"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sales;
