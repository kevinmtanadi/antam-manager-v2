"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
  Snippet,
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
import CreateProductModal from "./CreateProductModal";
import { formatDate, formatRupiah } from "../helper";
import { BiSearch } from "react-icons/bi";
import { PlusIcon } from "@/icons/PlusIcon";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";

interface ProductObj {
  name: string;
  weight: number;
}
interface StockObj {
  id: string;
  productId: string;
  cost: number;
  createdAt: string;
  transactionId: string;
  product: ProductObj;
}

interface FetchStockParams {
  search?: string;
  weight?: number;
  page: number;
  rows_per_page: number;
}

interface FetchStockData {
  stocks: StockObj[];
  totalItems: number;
  totalFiltered: number;
}

const Product = () => {
  const [r, setR] = useState(0);
  const rerender = () => setR(r + 1);
  const [params, setParams] = useState<FetchStockParams>({
    search: "",
    page: 1,
    rows_per_page: 10,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["stocks", params, r],
    queryFn: async () => {
      try {
        const res = await axios.get<FetchStockData>("/api/product/stock", {
          params,
        });
        return res.data;
      } catch (error) {
        alert(error);
      }
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const headers = [
    {
      key: "id",
      label: "Kode Stok",
    },
    {
      key: "product",
      label: "Produk",
    },

    {
      key: "weight",
      label: "Berat",
    },
    {
      key: "cost",
      label: "Harga",
    },
    {
      key: "createdAt",
      label: "Tanggal Pembelian",
    },
    {
      key: "action",
      label: "",
    },
  ];

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [weightList, setWeightList] = useState([
    {
      value: 0,
      label: "Semua",
    },
  ]);
  const {} = useQuery({
    queryKey: ["weights"],
    queryFn: async () => {
      await axios
        .get("/api/product/weight")
        .then((res) => {
          const weights = [];
          for (const item of res.data) {
            weights.push({
              value: item.weight,
              label: item.weight + " g",
            });
          }
          console.log(weights);
          setWeightList([...weightList, ...weights]);
        })
        .catch((error) => {
          alert(error);
        });

      return;
    },
  });

  return (
    <div className="mt-7 w-full flex justify-center">
      <div className="grid grid-cols-1 gap-4 w-full">
        <div className="flex w-full gap-4">
          <Table
            color="primary"
            selectionMode="single"
            aria-label="Tabel stock"
            topContent={
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center">
                  <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Cari produk atau stok"
                    startContent={<BiSearch />}
                    value={params.search}
                    onClear={() => setParams({ ...params, search: "" })}
                    onValueChange={(e) => setParams({ ...params, search: e })}
                  />
                  <div className="flex gap-4">
                    <Select
                      color="primary"
                      defaultSelectedKeys={[0]}
                      items={weightList}
                      className="w-36"
                      onChange={(e) =>
                        setParams({
                          ...params,
                          weight: +e.target.value,
                        })
                      }
                    >
                      {(weight: any) => (
                        <SelectItem key={weight.value} value={weight.value}>
                          {weight.label}
                        </SelectItem>
                      )}
                    </Select>
                    <Button
                      onClick={onOpen}
                      endContent={<PlusIcon fontSize={"1.5rem"} />}
                      className="text-white"
                      color="success"
                    >
                      Tambah Produk
                    </Button>
                  </div>
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
                {data?.totalItems && (
                  <Pagination
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
            ) : data?.stocks ? (
              <TableBody>
                {data.stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>
                      <Snippet className="text-md h-7 bg-transparent" symbol="">
                        {stock.id}
                      </Snippet>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="text-sm">{stock.productId}</div>
                        <div className="text-sm whitespace-nowrap text-default-400">
                          {stock.product.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{stock.product.weight} g</TableCell>
                    <TableCell>{formatRupiah(stock.cost)}</TableCell>
                    <TableCell>
                      {formatDate(stock.createdAt, "dd-mm-yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              radius="full"
                              size="sm"
                              variant="light"
                            >
                              <VerticalDotsIcon className="text-lg text-default-400" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem>View</DropdownItem>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Delete</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
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
      <CreateProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSuccess={rerender}
      />
    </div>
  );
};

export default Product;
