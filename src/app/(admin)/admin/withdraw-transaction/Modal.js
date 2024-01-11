import { formatter } from "@/utilities/utils";
import { Button, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";

const ModalDetail = ({ openModal, setOpenModal, data }) => {
  const [reason, setReason] = useState(null);
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
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
            placeholder="Lí do từ chối"
          />
        </div>
        <div></div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetail;
