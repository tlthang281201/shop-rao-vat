"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";
import moment from "moment/moment";
import { supabase } from "@/supabase/supabase-config";
import { getAllPost } from "@/services/PostService";
import Image from "next/image";
import { getAllCoinPrice } from "@/services/CoinService";
import { formatDongCu } from "@/utilities/utils";
import ModalCreateCoin from "./ModalCreate";
import { Button, Modal } from "flowbite-react";
import ModalUpdateCoin from "./ModalUpdate";

const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: "rgba(0, 0, 0, 0.12)",
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "rgba(0, 0, 0, 0.12)",
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:nth-last-child(2)": {
        position: "sticky",
        right: "50px",
        backgroundColor: "#fff",
      },
      "&:last-child": {
        position: "sticky",
        right: "0",
        backgroundColor: "#fff",
      },
      fontSize: "15px",
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "rgba(0, 0, 0, 0.12)",
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:nth-last-child(2)": {
        position: "sticky",
        right: "50px",
        backgroundColor: "#fff",
      },
      "&:last-child": {
        position: "sticky",
        right: "0",
        backgroundColor: "#fff",
      },
    },
  },
};

const paginationComponentOptions = {
  noRowsPerPage: true,
  rowsPerPageText: "Số hàng mỗi trang",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Tất cả",
};

const ListCoinComponent = () => {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openUpdateModal, setOpenModalUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);

  const [coin, setCoin] = useState({});

  const fetchData = async () => {
    const { data, error } = await getAllCoinPrice();
    setData(data);
    setPending(false);
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const deleteById = async (id) => {
    const { error } = await supabase
      .from("exchange_coin")
      .delete()
      .eq("id", id);
    fetchData();
    setOpenModal(false);
    if (!error) {
      toast.success("Xoá thành công");
    } else {
      toast.error(`Lỗi! ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = useMemo(
    () => [
      {
        name: "Giá tiền",
        wrap: true,
        width: "130px",
        sortable: true,
        selector: (row) => formatter.format(row.price),
      },

      {
        name: "Đồng Cũ",
        wrap: true,
        sortable: true,
        width: "150px",
        selector: (row) => formatDongCu(row.coin),
      },

      {
        name: "Ngày tạo",
        selector: (row) => row.created_at,
        wrap: true,
        sortable: true,
        width: "220px",
        format: (row) => moment(row.created_at).format("DD/MM/YYYY, HH:mm:ss"),
      },
      {
        name: "Ngày cập nhập",
        selector: (row) =>
          row.updated_at
            ? moment(row.updated_at).format("DD/MM/YYYY, HH:mm:ss")
            : "",
        wrap: true,
        sortable: true,
        width: "220px",
      },

      {
        button: "true",
        cell: (row) => (
          <Link
            onClick={() => {
              setCoin(row);
              setOpenModalUpdate(true);
            }}
            href={`#`}
            style={{ color: "green" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          </Link>
        ),
        width: "50px",
      },
      {
        button: "true",
        cell: (row) => (
          <button
            onClick={() => {
              setOpenModal(true);
              setId(row.id);
            }}
            className="text-danger"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ),
        width: "50px",
      },
    ],
    []
  );
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4
          className="text-title-md2 font-semibold text-black"
          style={{
            textTransform: "uppercase",
            fontSize: "20px",
            color: "rgb(28 36 52)",
          }}
        >
          Bảng giá quy đổi Đồng Cũ
        </h4>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link
                onClick={() => setOpenModalCreate(true)}
                href={"#"}
                className="flex items-center rounded bg-primary px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white hover:bg-primary-600 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Thêm mới
              </Link>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col gap-10">
        {pending ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            persistTableHead
            noDataComponent={
              <span className="text-danger pt-10">Không tìm thấy dữ liệu</span>
            }
          />
        )}
      </div>
      <ModalCreateCoin
        openModal={openModalCreate}
        setOpenModal={setOpenModalCreate}
        fetchData={fetchData}
      />

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xoá gói nạp này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteById(id);
                }}
              >
                Vâng, chắc chắn
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ModalUpdateCoin
        setOpenModal={setOpenModalUpdate}
        openModal={openUpdateModal}
        data={coin}
        fetchData={fetchData}
      />
    </>
  );
};

export default ListCoinComponent;
