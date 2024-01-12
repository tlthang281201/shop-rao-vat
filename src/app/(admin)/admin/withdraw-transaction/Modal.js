"use client";
import { supabase } from "@/supabase/supabase-config";
import { formatter } from "@/utilities/utils";
import { Button, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ModalDetail = ({ openModal, setOpenModal, data, fetchData }) => {
  const [reason, setReason] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(data);
  const approvalRequest = async (val) => {
    setLoading(true);
    if (val === 2) {
      if (reason) {
        const { error } = await supabase
          .from("withdraw_history")
          .update({ status: val, reject_reason: reason })
          .eq("id", data?.id);
        fetchData();
        setReason(null);
        setOpenModal(false);
        toast.success("Cập nhập thành công");
      } else {
        toast.error("Vui lòng nhập lí do từ tối");
      }
    } else {
      const { error } = await supabase
        .from("withdraw_history")
        .update({ status: val })
        .eq("id", data?.id);
      const res = await supabase
        .from("users")
        .select()
        .eq("id", data?.user_id?.id)
        .single();
      const res2 = await supabase
        .from("users")
        .update({ cash_wallet: res.data.cash_wallet - data?.cash })
        .eq("id", data?.user_id?.id);
      fetchData();
      setReason(null);
      setOpenModal(false);
      toast.success("Cập nhập thành công");
    }
    setLoading(false);
  };

  return (
    <Modal
      show={openModal}
      style={{ zIndex: 9999 }}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Header>Chi tiết</Modal.Header>
      <Modal.Body className="space-y-6">
        <p style={{ color: "black" }}>ID Giao dịch: {data?.id}</p>
        <p style={{ color: "black" }}>
          Nội dung: Yêu cầu rút tiền vào tài khoản{" "}
          {data?.type === 1 ? `Ngân hàng ${data?.bank_name}` : "Momo"}
        </p>
        {data?.type === 1 && (
          <>
            <p style={{ color: "black" }}>
              Số tiền rút:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {formatter.format(data?.cash)}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Ngân hàng thụ hưởng:{" "}
              <span className="text-red-600 " style={{ fontWeight: "bold" }}>
                {data?.bank_name}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Số tài khoản:{" "}
              <span className="text-red-600 " style={{ fontWeight: "bold" }}>
                {data?.account_number}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Tên người thụ hưởng:{" "}
              <span className="text-red-600 " style={{ fontWeight: "bold" }}>
                {data?.name}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Trạng thái:{" "}
              <span
                style={{ fontWeight: "bold" }}
                className={
                  data?.status === 0
                    ? `text-blue-600`
                    : data?.status === 1
                    ? "text-green-600 "
                    : "text-red-600 "
                }
              >
                {data?.status === 0
                  ? "Chưa duyệt"
                  : data?.status === 1
                  ? "Thành công"
                  : "Thất bại"}
              </span>
            </p>
          </>
        )}
        {data?.type === 2 && (
          <>
            <p style={{ color: "black" }}>
              Số tiền rút:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {formatter.format(data?.cash)}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Số điện thoại momo:{" "}
              <span className="text-red-600 " style={{ fontWeight: "bold" }}>
                {data?.momo_phone}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Tên thụ hưởng:{" "}
              <span className="text-red-600 " style={{ fontWeight: "bold" }}>
                {data?.name}
              </span>
            </p>
            <p style={{ color: "black" }}>
              Trạng thái:{" "}
              <span
                style={{ fontWeight: "bold" }}
                className={
                  data?.status === 0
                    ? `text-blue-600`
                    : data?.status === 1
                    ? "text-green-600 "
                    : "text-red-600 "
                }
              >
                {data?.status === 0
                  ? "Chưa duyệt"
                  : data?.status === 1
                  ? "Thành công"
                  : "Thất bại"}
              </span>
            </p>
          </>
        )}
        {data?.status === 2 && (
          <p style={{ color: "black" }}>
            Lý do: <span className="text-red-600">{data?.reject_reason}</span>
          </p>
        )}
        <div className="flex flex-row items-center">
          <span style={{ fontSize: "13px", color: "black", width: "20%" }}>
            Lí do từ chối
          </span>
          <TextInput
            type="text"
            className="w-full"
            color="failure"
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lí do từ chối"
          />
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
          <div></div>
          <div className="flex flex-row gap-2">
            <Button
              color="light"
              onClick={() => setOpenModal(false)}
              disabled={loading}
            >
              Đóng
            </Button>
            <div className="flex flex-row">
              <Button
                color="failure"
                onClick={() => approvalRequest(2)}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 me-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Từ chối
              </Button>
            </div>

            <div className="">
              <Button
                color="success"
                className="text-xs"
                onClick={() => approvalRequest(1)}
                isProcessing={loading}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 me-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                Duyệt
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetail;
