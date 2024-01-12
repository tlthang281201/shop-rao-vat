import Slide from "@/app/(admin)/components/SlickSlide/Slide";

import { formatter } from "@/utilities/utils";
import {
  Button,
  FileInput,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import moment from "moment";

import { toast } from "sonner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { supabase } from "@/supabase/supabase-config";
import { useState } from "react";
const ModalDetail = ({ openModal, setOpenModal, fetchData, data }) => {
  const [reason, setReason] = useState(null);
  const [error, setError] = useState(null);
  const approvalPost = async (val) => {
    if (val === 2) {
      if (reason) {
        const { error } = await supabase
          .from("post")
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
        .from("post")
        .update({ status: val })
        .eq("id", data?.id);
      fetchData();
      setOpenModal(false);
      toast.success("Cập nhập thành công");
    }
  };
  return (
    <Modal
      style={{ zIndex: 99999 }}
      show={openModal}
      size="3xl"
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <Modal.Header>Chi tiết bài đăng</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <Slide data={data} />
          <div style={{ border: "1px solid #d1d1d1", borderRadius: "5px" }}>
            <div
              style={{
                color: "black",
                fontWeight: "bold",
                padding: "10px",
                borderBottom: "1px solid #d1d1d1",
              }}
            >
              THÔNG TIN CHUNG
            </div>
            <div className="mt-3">
              <label
                style={{
                  fontWeight: "bold",
                  padding: "10px",
                  fontSize: "15px",
                  color: "black",
                }}
              >
                Tiêu đề:{" "}
              </label>
              <span style={{ color: "black", fontWeight: "bold" }}>
                {data?.title}
              </span>
            </div>

            <div className="flex flex-row" style={{ padding: "10px" }}>
              <div
                className="flex flex-col gap-2"
                style={{ fontSize: "13px", color: "black" }}
              >
                <label style={{ fontWeight: "bold" }}>Loại danh mục: </label>
                <label style={{ fontWeight: "bold" }}>Người đăng: </label>
                <label style={{ fontWeight: "bold" }}>Giá: </label>
              </div>
              <div
                className="flex flex-col gap-2"
                style={{ fontSize: "13px", color: "black", marginLeft: "50px" }}
              >
                <span>{data?.cate_c_id?.name}</span>
                <span>{data?.users?.name}</span>
                <span style={{ color: "red", fontSize: "17px" }}>
                  {data?.price ? formatter.format(data?.price) : "Thoả thuận"}
                </span>
              </div>
              <div
                className="flex flex-col gap-2"
                style={{ fontSize: "13px", color: "black", marginLeft: "40px" }}
              >
                <label style={{ fontWeight: "bold" }}>Trạng thái bài: </label>
                <label style={{ fontWeight: "bold" }}>Số điện thoại: </label>
                <label style={{ fontWeight: "bold" }}>Ngày đăng: </label>
              </div>
              <div
                className="flex flex-col gap-2"
                style={{ fontSize: "13px", color: "black", marginLeft: "40px" }}
              >
                <span
                  style={{ color: "red", fontSize: "17px", fontWeight: "bold" }}
                  className="text-danger"
                >
                  {data?.status === 0
                    ? "Chờ duyệt"
                    : data?.status === 1
                    ? "Đã duyệt"
                    : "Bị từ chối"}
                </span>
                <span>{data?.phone}</span>
                <span>
                  {moment(data?.created_at).format("DD/MM/YYYY - H:m:ss")}
                </span>
              </div>
            </div>
            <div
              className="flex flex-row px-3 pb-3"
              style={{ color: "black", fontSize: "13px" }}
            >
              <div className="flex flex-col">
                <label style={{ fontWeight: "bold" }}>Địa chỉ: </label>
              </div>
              <div className="flex flex-col" style={{ marginLeft: "97px" }}>
                <span>
                  {data?.address}, {data?.ward?.name}, {data?.district?.name},{" "}
                  {data?.city?.name},{" "}
                </span>
              </div>
            </div>
          </div>
          <div style={{ border: "1px solid #d1d1d1", borderRadius: "5px" }}>
            <div
              style={{
                color: "black",
                fontWeight: "bold",
                padding: "10px",
                borderBottom: "1px solid #d1d1d1",
              }}
            >
              MÔ TẢ CHI TIẾT
            </div>
            <form>
              <p
                style={{ color: "black", padding: "10px", fontSize: "13px" }}
                dangerouslySetInnerHTML={{ __html: data?.description }}
              ></p>
            </form>
          </div>
          <div className="flex flex-row items-center gap-2">
            <span style={{ fontSize: "13px", width: "20%", color: "black" }}>
              Lí do từ chối
            </span>
            <TextInput
              type="text"
              color="failure"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lí do từ chối"
              className="w-full"
            />
            <span className="text-danger">{error}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <div></div>
            <div className="flex flex-row gap-2">
              <Button color="light">Đóng</Button>
              <div className="flex flex-row">
                <Button color="failure" onClick={() => approvalPost(2)}>
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
                  onClick={() => approvalPost(1)}
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetail;
