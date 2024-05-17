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
  DateValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { formatDate, formatRupiah } from "../helper";

import "react-toastify/dist/ReactToastify.css";

interface SaleItem {
  stockId: string;
  productId: string;
  cost: number;
  price: number;
  isLoading?: boolean;
  selection: stock[];
}

interface stock {
  id: string;
  cost: number;
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
      productId: "",
      cost: 0,
      price: 0,
      selection: [],
    },
  ]);

  const addEmptyItem = () => {
    setItems([
      ...items,
      {
        stockId: "",
        cost: 0,
        productId: "",
        price: 0,
        selection: [],
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

  const handleSale = () => {
    toast.promise(
      mutateAsync({
        createdAt: date.toDate(getLocalTimeZone()).toISOString(),
        status: "SALE",
        items: items
          .filter((item) => item.stockId !== "")
          .map((item) => {
            return {
              productId: item.productId || "",
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

  const [r, setR] = useState(0);
  const rerender = () => setR(r + 1);

  async function getStocks(i: number, productId: string) {
    // IF product is selected and has no selection yet
    if (productId != "") {
      await axios
        .get(`/api/product/${productId}`, {
          params: { fetch_stock: true },
        })
        .then((res) => {
          let stock = res.data.stock;

          const itemStockIds = new Set(items.map((item) => item.stockId));

          const filteredStock = stock.filter(
            (stock: any) => !itemStockIds.has(stock.id)
          );

          console.log(filteredStock);

          setItems([
            ...items.slice(0, i),
            {
              ...items[i],
              productId: productId,
              selection: filteredStock,
            },
            ...items.slice(i + 1),
          ]);
        });
    }
  }

  return (
    <div className="mt-7 flex justify-center text-default-900">
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
              <TableColumn>Produk</TableColumn>
              <TableColumn>Item</TableColumn>
              <TableColumn>Harga</TableColumn>
              <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell width={"35%"}>
                    <div className="flex flex-col">
                      <Select
                        selectionMode="single"
                        value={item.productId}
                        className="bg-transparent text-default-900 text-small"
                        onChange={(e) => {
                          getStocks(idx, e.target.value);
                        }}
                      >
                        {types?.map((type: any) => (
                          <SelectItem
                            className="bg-transparent text-default-900"
                            key={type.id}
                            value={type.id}
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell width={"35%"}>
                    <div className="flex flex-col">
                      <Select
                        value={item.stockId}
                        isRequired
                        selectionMode="single"
                        onChange={(e) => {
                          setItems([
                            ...items.slice(0, idx),
                            { ...item, stockId: e.target.value },
                            ...items.slice(idx + 1),
                          ]);
                          rerender();
                        }}
                        className="text-default-900"
                        defaultSelectedKeys={[0]}
                        disabledKeys={[0]}
                        isLoading={item.isLoading}
                      >
                        {item.selection.length > 0 ? (
                          item.selection.map((selection: any) => (
                            <SelectItem
                              className="bg-transparent text-default-900"
                              key={selection.id}
                              value={selection.id}
                            >
                              {selection.id +
                                " - " +
                                formatRupiah(selection.cost)}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem
                            className="bg-transparent text-default-900"
                            key={0}
                            value={0}
                          >
                            Tidak ada produk
                          </SelectItem>
                        )}
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

export default Sales;

interface Props {
  productId: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const ItemSelector = ({ productId, onChange }: Props) => {
  const { data: stocks } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await axios.get(`/api/product/${productId}`);
      return res.data;
    },
  });

  return (
    <Select
      isDisabled={productId === ""}
      className="bg-transparent text-default-900 text-small"
      onChange={onChange}
    >
      {stocks?.map((stock: any) => (
        <SelectItem
          className="bg-transparent text-default-900"
          key={stock.id}
          value={stock.id}
        >
          {stock.id} - {stock.price}
        </SelectItem>
      ))}
    </Select>
  );
};
