import OverlaySpinner from "@/component/OverlaySpinner";
import {
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, formatRupiah } from "../helper";
import { LuCopy } from "react-icons/lu";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string;
}
const DetailProductModal = ({ isOpen, onOpenChange, id }: Props) => {
  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["product", id, "fetch_stock"],
    queryFn: async () => {
      if (!id || id === "") {
        return;
      }
      const res = await axios.get(`/api/product/${id}`, {
        params: {
          fetch_stock: true,
        },
      });
      return res.data;
    },
  });

  if (!id) {
    return <></>;
  }
  return (
    <>
      <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {isLoading && <OverlaySpinner />}
              <ModalHeader>Detail Produk</ModalHeader>
              <ModalBody>
                <Table hideHeader isStriped removeWrapper>
                  <TableHeader>
                    <TableColumn> </TableColumn>
                    <TableColumn> </TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Kode Produk</TableCell>
                      <TableCell>{productDetail?.product.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell>{productDetail?.product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Berat</TableCell>
                      <TableCell>
                        {productDetail && productDetail.product.weight + " g"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table radius="sm">
                  <TableHeader>
                    <TableColumn>Kode Stok</TableColumn>
                    <TableColumn>Harga Beli</TableColumn>
                    <TableColumn>Tanggal Pembelian</TableColumn>
                    <TableColumn>Kode Transaksi</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {productDetail?.stock?.map((stock: any) => (
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
                                  <div className="text-sm font-bold">
                                    Copied
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <div>{stock.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatRupiah(stock.cost)}</TableCell>
                        <TableCell>
                          {formatDate(stock.createdAt, "dd mmm yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Popover placement="bottom-start">
                              <PopoverTrigger>
                                <Button
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      stock.transactionId
                                    )
                                  }
                                  className="bg-transparent h-7 w-7 min-w-10 p-0"
                                  variant="light"
                                >
                                  <LuCopy id={stock.transactionId} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className="px-1 py-2">
                                  <div className="text-sm font-bold">
                                    Copied
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <div>{stock.transactionId}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default DetailProductModal;
