import { supabaseAdmin } from "@/supabase/supabase-config";
import upLoadImage from "@/utilities/UpSlide";
import {
  Button,
  FileInput,
  Label,
  Modal,
  TextInput,
  Textarea,
} from "flowbite-react";
import Image from "next/image";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { toast } from "sonner";

const ModalCreateCoin = ({ openModal, setOpenModal, fetchData }) => {
  const [price, setPrice] = useState(0);
  const [coin, setCoin] = useState(0);
  const [errors, setErrors] = useState({ price: null, coin: null });

  const validateCoin = (value) => {
    setCoin(value);
    if (value > 0) {
      if (value <= 50000000) {
        setErrors({
          ...errors,
          coin: null,
        });
      } else {
        setErrors({
          ...errors,
          coin: "Vui lòng nhập số đồng cũ nhỏ hơn hơn 50,000,000",
        });
      }
    } else {
      setErrors({ ...errors, coin: "Vui lòng nhập số đồng cũ lớn hơn 0" });
    }
  };

  const validatePrice = (value) => {
    setPrice(value);
    if (value > 0) {
      if (value <= 50000000) {
        setErrors({
          ...errors,
          price: null,
        });
      } else {
        setErrors({
          ...errors,
          price: "Vui lòng nhập số tiền nhỏ hơn hơn 50,000,000",
        });
      }
    } else {
      setErrors({ ...errors, price: "Vui lòng nhập số tiền lớn hơn 0" });
    }
  };
  const handleSubmit = async () => {
    if (errors.coin || errors.price || price <= 0 || coin <= 0) {
      toast.error("Vui lòng nhập đúng dữ liệu");
    } else {
      const { data, error } = await supabaseAdmin
        .from("exchange_coin")
        .insert({ price: price, coin: coin, active: true });
      if (!error) {
        toast.success("Thêm mới thành công");
        fetchData();
        setOpenModal(false);
        setCoin(0);
        setPrice(0);
        setErrors({ coin: null, price: null });
      }
      if (error) {
        toast.error(`Lỗi ${error.message}`);
      }
    }
  };
  return (
    <Modal
      size="md"
      style={{ zIndex: 99999 }}
      show={openModal}
      onClose={() => {
        setOpenModal(false);
        setCoin(0);
        setPrice(0);
        setErrors({ coin: null, price: null });
      }}
    >
      <Modal.Header>Thêm mới gói nạp</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="des" value="Nhập số tiền" />
            </div>
            <CurrencyInput
              value={price}
              suffix="  VNĐ"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onValueChange={(value) => {
                validatePrice(value);
              }}
              allowNegativeValue={false}
            />
            <span className="text-danger">{errors.price}</span>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="des" value="Nhập số đồng cũ tương ứng" />
            </div>
            <CurrencyInput
              value={coin}
              suffix="  Đồng Cũ"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onValueChange={(value) => {
                validateCoin(value);
              }}
              allowNegativeValue={false}
            />
            <span className="text-danger">{errors.coin}</span>
          </div>

          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <Button
              onClick={() => {
                handleSubmit();
              }}
              color="success"
            >
              Thêm mới
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateCoin;
