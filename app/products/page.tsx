"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  useDisclosure,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { formatRupiah } from "../helper";
import { PlusIcon } from "@/icons/PlusIcon";
import CreateProductModal from "./CreateProductModal";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { EditIcon } from "@/icons/EditIcon";
import { EyeIcon } from "@/icons/EyeIcon";
import { VerticalDotsIcon } from "@/icons/VerticalDotsIcon";
import DeleteProductModal from "./DeleteProductModal";
import EditProductModal from "./EditProductModal";
import DetailProductModal from "./DetailProductModal";

const Products = () => {
  const { data: products, isLoading } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/product");
        return res.json();
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  const [id, setId] = useState("");

  const queryClient = useQueryClient();
  const rerender = () =>
    queryClient.invalidateQueries({ queryKey: ["products"] });

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();
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

  return (
    <div className="mt-7 w-full flex flex-col gap-5 justify-center text-default-900">
      <div className="w-full flex justify-end">
        <Button
          onClick={onCreateOpen}
          endContent={<PlusIcon fontSize={"1.5rem"} />}
          className="text-white"
          color="success"
        >
          Tambah Produk
        </Button>
      </div>
      <div className="w-full grid gap-5 xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-5 text-center">
            <Spinner size="lg" />
          </div>
        ) : products?.length && products?.length > 0 ? (
          products
            ?.filter((product) => product.id !== "")
            .map((product) => (
              <Card key={product.id} radius="sm">
                <CardHeader>
                  <div className="w-full flex justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-md font-semibold">{product.id}</div>
                      <div className="text-md text-default-500">
                        {product.name}
                      </div>
                    </div>
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
                              setId(product.id);
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
                              setId(product.id);
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
                              setId(product.id);
                              onDeleteOpen();
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <p className="text-sm text-default-500">Berat</p>
                      <p className="text-sm font-semibold">
                        {product.weight} g
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-default-500">Stok</p>
                      <p className="text-sm font-semibold">{product.stock}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-default-500">Harga Terendah</p>
                      <p className="text-sm font-semibold">
                        {formatRupiah(product.min_price)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-default-500">Harga Rerata</p>
                      <p className="text-sm font-semibold">
                        {formatRupiah(product.stock)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
        ) : (
          <div className="col-span-5 text-center">
            Belum ada produk terdaftar
          </div>
        )}
      </div>
      <CreateProductModal
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        onSuccess={rerender}
      />
      <DeleteProductModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        id={id}
        onSuccess={rerender}
      />
      <EditProductModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        id={id}
        onSuccess={rerender}
      />
      <DetailProductModal
        isOpen={isDetailOpen}
        onOpenChange={onDetailOpenChange}
        id={id}
      />
    </div>
  );
};

export default Products;
