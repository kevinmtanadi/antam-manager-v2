import OverlaySpinner from "@/component/OverlaySpinner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate, formatRupiah } from "../helper";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  id: string;
}
const DetailStockModal = ({ isOpen, onOpenChange, id }: Props) => {
  const { data: stockDetail, isLoading } = useQuery({
    queryKey: ["stock", id],
    queryFn: async () => {
      const res = await axios.get(`/api/product/stock/${id}`);
      return res.data;
    },
  });

  if (!id) {
    return <></>;
  }
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="text-default-900"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {isLoading && <OverlaySpinner />}
              <ModalHeader>Detail Stok</ModalHeader>
              <ModalBody>
                <Table removeWrapper radius="none" hideHeader isStriped>
                  <TableHeader>
                    <TableColumn>Nama</TableColumn>
                    <TableColumn>Data</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell className="font-semibold">Kode Stok</TableCell>
                      <TableCell>
                        {stockDetail && stockDetail[0]?.stock.id}
                      </TableCell>
                    </TableRow>
                    <TableRow key="2">
                      <TableCell className="font-semibold">Produk</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p>{stockDetail && stockDetail[0].product.id}</p>
                          <p className="text-default-500">
                            {stockDetail && stockDetail[0].product.name}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow key="3">
                      <TableCell className="font-semibold">Berat</TableCell>
                      <TableCell>
                        {stockDetail && stockDetail[0].product.weight + " g"}
                      </TableCell>
                    </TableRow>
                    <TableRow key="4">
                      <TableCell className="font-semibold">
                        Harga Beli
                      </TableCell>
                      <TableCell>
                        {stockDetail && formatRupiah(stockDetail[0].stock.cost)}
                      </TableCell>
                    </TableRow>
                    <TableRow key="5">
                      <TableCell className="font-semibold">
                        Tanggal Beli
                      </TableCell>
                      <TableCell>
                        {stockDetail &&
                          formatDate(
                            stockDetail[0]?.stock.createdAt,
                            "dd mmm yyyy"
                          )}
                      </TableCell>
                    </TableRow>
                    <TableRow key="6">
                      <TableCell className="font-semibold">
                        Terakhir Update
                      </TableCell>
                      <TableCell>
                        {stockDetail &&
                          formatDate(
                            stockDetail[0]?.stock.updatedAt,
                            "dd mmm yyyy HH:MM:SS"
                          )}
                      </TableCell>
                    </TableRow>
                    <TableRow key="7">
                      <TableCell className="font-semibold">
                        Kode Transaksi
                      </TableCell>
                      <TableCell>
                        {stockDetail && stockDetail[0]?.stock.transactionId}
                      </TableCell>
                    </TableRow>
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

export default DetailStockModal;
