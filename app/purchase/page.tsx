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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "../helper";

import "react-toastify/dist/ReactToastify.css";

interface PurchaseItem {
  stockId: string;
  productId: string;
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

const Purchase = () => {
  const today = new Date().toISOString();
  const [date, setDate] = React.useState<DateValue>(
    parseDate(formatDate(today, "yyyy-mm-dd"))
  );
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      stockId: "",
      productId: "",
      price: 0,
    },
  ]);

  const addEmptyItem = () => {
    setItems([
      ...items,
      {
        stockId: "",
        productId: "",
        price: 0,
      },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: PostTransaction) => {
      await axios.post("/api/transaction", body);
    },
    onSuccess: () => {
      setItems([]);
    },
  });

  const handlePurchase = () => {
    console.log(items);
    console.log(items[0].price);
    const purchaseItems = items.filter((item) => item.price > 0);
    console.log(purchaseItems);

    if (purchaseItems.length == 0) {
      toast.error("Item kosong");
      return;
    }

    toast.promise(
      mutateAsync({
        createdAt: date.toDate(getLocalTimeZone()).toISOString(),
        status: "PURCHASE",
        items: purchaseItems.map((item) => {
          return {
            productId: item.productId,
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

  const { data: types } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/product/type");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
                  onClick={handlePurchase}
                  isDisabled={items.length <= 0}
                >
                  Beli
                </Button>
              </div>
            }
            className=""
            radius="sm"
            aria-label="Tabel pembelian"
          >
            <TableHeader>
              <TableColumn>Kode Item</TableColumn>
              <TableColumn>Produk</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell width={"40%"}>
                    <div className="flex gap-2 justify-between">
                      <Input
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
                    </div>
                  </TableCell>
                  <TableCell width={"40%"}>
                    <div className="flex flex-col">
                      <Select
                        value={item.productId}
                        className="bg-transparent text-white text-small"
                        onChange={(e) => {
                          setItems([
                            ...items.slice(0, idx),
                            {
                              ...item,
                              productId: e.target.value,
                            },
                            ...items.slice(idx + 1),
                          ]);
                        }}
                      >
                        {types?.map((type: any) => (
                          <SelectItem
                            className="bg-transparent text-black"
                            key={type.id}
                            value={type.id}
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
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

export default Purchase;
