"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import React, { useEffect, useState } from "react";
import { formatDate, formatRupiah } from "../helper";
import { BiSearch } from "react-icons/bi";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import { EyeIcon } from "@/icons/EyeIcon";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/DeleteIcon";
import DeleteStockModal from "./DeleteStockModal";
import EditStockModal from "./EditStockModal";
import { LuCopy } from "react-icons/lu";
import DetailStockModal from "./DetailStockModal";

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
  productId?: string;
}

interface FetchStockData {
  stocks: StockObj[];
  totalItems: number;
  totalFiltered: number;
}

const Stock = () => {
  const [r, setR] = useState(0);
  const rerender = () => setR(r + 1);
  const [params, setParams] = useState<FetchStockParams>({
    search: "",
    page: 1,
    rows_per_page: 10,
    productId: "",
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
        console.log(error);
      }
    },
  });

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
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const [id, setId] = useState<string>("");

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

  const [typeList, setTypeList] = useState<any[]>([]);
  useEffect(() => {
    if (!types) return;

    setTypeList([
      {
        id: "",
        name: "Semua",
      },
      ...types,
    ]);
  }, [types]);

  return (
    <div className="mt-7 w-full flex justify-center text-default-900">
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
                  <div className="flex gap-4 items-center">
                    <Select
                      defaultSelectedKeys={[""]}
                      value={params.productId}
                      className="bg-transparent text-white text-small w-56"
                      onChange={(e) => {
                        setParams({
                          ...params,
                          productId: e.target.value,
                        });
                      }}
                      isRequired
                    >
                      {typeList.map((type: any) => (
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
            ) : data?.stocks && data?.stocks.length > 0 ? (
              <TableBody>
                {data.stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Popover placement="bottom-start">
                          <PopoverTrigger>
                            <Button
                              onClick={() =>
                                navigator.clipboard.writeText(stock.id)
                              }
                              className="bg-transparent h-7 w-7 min-w-10 p-0"
                              variant="light"
                            >
                              <LuCopy id={stock.id} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-1 py-2">
                              <div className="text-sm font-bold">Copied</div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <div>{stock.id}</div>
                      </div>
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
                      {formatDate(stock.createdAt, "dd mmm yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="border-1 border-default-200 text-default-900">
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
                            <DropdownItem
                              onClick={() => {
                                setId(stock.id);
                                onDetailOpen();
                              }}
                              startContent={
                                <EyeIcon color="text-xl text-default-500 pointer-events-none flex-shrink-0" />
                              }
                            >
                              View Detail
                            </DropdownItem>
                            <DropdownItem
                              showDivider
                              startContent={
                                <EditIcon color="text-xl text-default-500 pointer-events-none flex-shrink-0" />
                              }
                              onClick={() => {
                                setId(stock.id);
                                onEditOpen();
                              }}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              className="text-red-500"
                              startContent={
                                <DeleteIcon color="text-xl text-default-500 pointer-events-none flex-shrink-0" />
                              }
                              onClick={() => {
                                setId(stock.id);
                                onDeleteOpen();
                              }}
                            >
                              Delete
                            </DropdownItem>
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

      <DetailStockModal
        isOpen={isDetailOpen}
        onOpenChange={onDetailOpenChange}
        id={id}
      />
      <DeleteStockModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        onSuccess={rerender}
        id={id}
      />
      <EditStockModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        onSuccess={rerender}
        id={id}
      />
    </div>
  );
};

export default Stock;
