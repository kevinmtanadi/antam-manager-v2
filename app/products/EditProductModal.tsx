import OverlaySpinner from "@/component/OverlaySpinner";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
  id: string;
}

const EditProductModal = ({ isOpen, onOpenChange, onSuccess, id }: Props) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (body: {
      id: string;
      newId?: string;
      name: string;
      productId?: string;
      weight: number;
    }) => {
      await axios.put("/api/product", body);
    },
    onSuccess: () => {
      onOpenChange();
      onSuccess && onSuccess();
    },
  });

  const handleEditProduct = (values: any) => {
    toast.promise(
      mutateAsync({
        id: id,
        newId: values.newId,
        name: values.name,
        weight: values.weight,
      }),
      {
        pending: "Mengupdate produk...",
        success: "Produk diupdate",
        error: "Produk gagal diupdate",
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      newId: "",
      name: "",
      weight: 0,
    },
    onSubmit: (values) => handleEditProduct(values),
  });

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id || id === "") {
        return;
      }
      const res = await axios.get(`/api/product/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    formik.setValues({
      newId: "",
      name: "",
      weight: 0,
    });
  }, [isOpen, formik]);

  useEffect(() => {
    if (!isLoading && productDetail && id) {
      formik.setValues({
        newId: productDetail.product.id,
        name: productDetail.product.name,
        weight: productDetail.product.weight,
      });
    }
  }, [productDetail, isLoading, formik]);

  if (!id) {
    return <></>;
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={formik.handleSubmit}>
              {isLoading && <OverlaySpinner />}
              <ModalHeader>Update Produk</ModalHeader>
              <ModalBody>
                <Input
                  isDisabled={isLoading}
                  value={formik.values.newId}
                  onChange={formik.handleChange}
                  name="newId"
                  radius="sm"
                  autoFocus
                  label="Kode Produk"
                  variant="bordered"
                />
                <Input
                  isDisabled={isLoading}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  name="name"
                  radius="sm"
                  autoFocus
                  label="Nama Produk"
                  variant="bordered"
                />
                <Input
                  isDisabled={isLoading}
                  type="number"
                  radius="sm"
                  label="Berat"
                  variant="bordered"
                  name="weight"
                  value={String(formik.values.weight)}
                  onChange={formik.handleChange}
                  validate={undefined}
                  isInvalid={false}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" type="submit">
                  Simpan
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default EditProductModal;
