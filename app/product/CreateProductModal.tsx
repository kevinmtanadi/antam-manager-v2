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
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Formik } from "formik";
import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
}
const CreateProductModal = ({ isOpen, onOpenChange, onSuccess }: Props) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (body: { id: string; name: string; weight: number }) => {
      await axios.post("/api/product", body);
    },
    onSuccess: () => {
      onOpenChange();
      onSuccess && onSuccess();
    },
  });

  const handleCreateProduct = (values: any) => {
    toast.promise(
      mutateAsync({ id: values.id, name: values.name, weight: values.weight }),
      {
        pending: "Menambahkan produk...",
        success: "Produk ditambahkan",
        error: "Produk gagal ditambahkan",
      }
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Formik
              initialValues={{
                id: "",
                name: "",
                weight: "",
              }}
              onSubmit={handleCreateProduct}
            >
              {({ values, handleSubmit, handleChange }) => (
                <form onSubmit={handleSubmit}>
                  <ModalHeader className="flex flex-col gap-1">
                    Tambah Produk
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      value={values.id}
                      onChange={handleChange}
                      name="id"
                      radius="sm"
                      autoFocus
                      label="Kode Produk"
                      variant="bordered"
                    />
                    <Input
                      value={values.name}
                      onChange={handleChange}
                      name="name"
                      radius="sm"
                      label="Nama Produk"
                      variant="bordered"
                    />
                    <Input
                      value={values.weight}
                      onChange={handleChange}
                      name="weight"
                      type="number"
                      placeholder="0.00"
                      radius="sm"
                      label="Berat"
                      variant="bordered"
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">g</span>
                        </div>
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Batal
                    </Button>
                    <Button color="primary" type="submit">
                      Tambah
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateProductModal;
