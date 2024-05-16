import OverlaySpinner from "@/component/OverlaySpinner";
import {
  Button,
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

const EditStockModal = ({ isOpen, onOpenChange, onSuccess, id }: Props) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (body: {
      id: string;
      newId?: string;
      productId?: string;
      cost?: number;
    }) => {
      await axios.put("/api/product/stock", body);
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
        productId: values.productId,
        cost: values.cost,
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
      productId: "",
      cost: 0,
    },
    onSubmit: (values) => handleEditProduct(values),
  });

  const { data: stockDetail, isLoading } = useQuery({
    queryKey: ["stock", id],
    queryFn: async () => {
      const res = await axios.get(`/api/product/stock/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!isLoading && stockDetail && stockDetail[0]) {
      formik.setValues({
        newId: stockDetail[0].stock.id,
        productId: stockDetail[0].stock.productId,
        cost: stockDetail[0].stock.cost,
      });
    }
  }, [stockDetail, isLoading]);

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
              <ModalHeader>Update Stok</ModalHeader>
              <ModalBody>
                <p className="bg-amber-400 text-white p-3 rounded-lg">
                  <b>Peringatan:</b> mengupdate data stok tidak akan memengaruhi
                  data transaksi
                </p>
                <Input
                  isDisabled={isLoading}
                  value={formik.values.newId}
                  onChange={formik.handleChange}
                  name="newId"
                  radius="sm"
                  autoFocus
                  label="Kode Stok"
                  variant="bordered"
                />
                <select
                  disabled={isLoading}
                  name="productId"
                  className="p-3 rounded-lg bg-transparent border-2 shadow-sm focus:border-black hover:border-gray-400"
                  value={formik.values.productId}
                  onChange={formik.handleChange}
                >
                  {types?.map((type: any) => (
                    <option
                      className="font-sans bg-transparent text-black"
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
                <Input
                  isDisabled={isLoading}
                  type="number"
                  radius="sm"
                  label="Harga Beli"
                  variant="bordered"
                  name="cost"
                  value={String(formik.values.cost)}
                  onChange={formik.handleChange}
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

export default EditStockModal;
