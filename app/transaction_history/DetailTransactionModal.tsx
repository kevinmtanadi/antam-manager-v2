import OverlaySpinner from "@/component/OverlaySpinner";
import {
  Button,
  Checkbox,
  Chip,
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

interface TransactionData {
  transaction: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalPrice: number;
    profit: number;
  };
  items: {
    id: number;
    transactionId: string;
    productId: string;
    stockId: string;
    price: number;
  }[];
}

const DetailTransactionModal = ({ isOpen, onOpenChange, id }: Props) => {
  const { data: transactionDetail, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const res = await axios.get(`/api/transaction/${id}`, {});
      return res.data;
    },
  });

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
              <ModalHeader>Detail Transaksi</ModalHeader>
              <ModalBody>
                <Table hideHeader isStriped removeWrapper>
                  <TableHeader>
                    <TableColumn> </TableColumn>
                    <TableColumn> </TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Kode Transaksi</TableCell>
                      <TableCell>{transactionDetail?.transaction.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jenis Transaksi</TableCell>
                      <TableCell>
                        {renderStatus(
                          transactionDetail?.transaction.status || ""
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tanggal Transaksi</TableCell>
                      <TableCell>
                        {formatDate(
                          transactionDetail?.transaction.createdAt || "",
                          "dd month yyyy"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Harga</TableCell>
                      <TableCell>
                        {formatRupiah(
                          transactionDetail?.transaction.totalPrice
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Profit</TableCell>
                      <TableCell>
                        {formatRupiah(transactionDetail?.transaction.profit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table radius="sm">
                  <TableHeader>
                    <TableColumn>Kode Stok</TableColumn>
                    <TableColumn>Kode Produk</TableColumn>
                    <TableColumn>Harga</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Tidak ada data">
                    {transactionDetail?.items?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.stockId}</TableCell>
                        <TableCell>{item.productId}</TableCell>
                        <TableCell>{formatRupiah(item.price)}</TableCell>
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

export default DetailTransactionModal;
