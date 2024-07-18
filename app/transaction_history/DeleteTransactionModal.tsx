import {
  Button,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { PiWarningCircleBold } from "react-icons/pi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
  id: string;
}
const DeleteTransactionModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
  id,
}: Props) => {
  const { mutateAsync: deleteTransaction } = useMutation({
    mutationFn: async (id: string) => {
      await axios
        .delete(`/api/transaction`, { params: { id: id } })
        .catch((error) => {
          console.log(error);
        });
    },
    onSuccess: () => {
      onOpenChange();
      onSuccess && onSuccess();
    },
  });

  const handleDelete = (id: string) => {
    toast.promise(deleteTransaction(id), {
      pending: "Menghapus transaksi...",
      success: "Transaksi dihapus",
      error: "Transaksi gagal dihapus",
    });
  };

  const [input, setInput] = React.useState("");
  useEffect(() => {
    setInput("");
  }, [isOpen]);

  if (id === "") {
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
              <ModalHeader>Hapus Stok</ModalHeader>
              <ModalBody>
                <p>
                  Apakah Anda yakin ingin menghapus transaksi <b>{id}</b>? Data
                  transaksi akan dihapus namun data stok terkait transaksi ini
                  tidak akan diubah
                </p>
                <Chip
                  className="self-center w-full"
                  variant="flat"
                  color="danger"
                  radius="sm"
                >
                  <div className="flex gap-3">
                    <PiWarningCircleBold fontSize={"1.2rem"} />
                    <p>Transaksi akan dihapus dan tidak dapat dikembalikan</p>
                  </div>
                </Chip>
                <Divider />
                <label htmlFor="input-delete">
                  Ketik <b>hapus</b> dibawah untuk konfirmasi penghapusan
                  transaksi
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  id="input-delete"
                  name="input-delete"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  isDisabled={input !== "hapus"}
                  color="primary"
                  type="submit"
                  onClick={() => handleDelete(id)}
                >
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default DeleteTransactionModal;
