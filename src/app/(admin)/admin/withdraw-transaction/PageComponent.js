"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";
import moment from "moment/moment";
import { supabase } from "@/supabase/supabase-config";
import { formatDongCu } from "@/utilities/utils";
import { Button, Modal } from "flowbite-react";
import ModalDetail from "./Modal";

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
    },
  },
};

const paginationComponentOptions = {
  noRowsPerPage: true,
  rowsPerPageText: "Số hàng mỗi trang",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Tất cả",
};

const PageComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [request, setRequest] = useState(null);
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("withdraw_history")
      .select(`*,user_id(id,name)`)
      .eq("status", 0)
      .order("created_at", { ascending: false });
    setData(data);
    setPending(false);
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const deleteById = async (id) => {};

  useEffect(() => {
    fetchData();
  }, []);
  const columns = useMemo(
    () => [
      {
        name: "ID",
        wrap: true,
        width: "70px",
        sortable: true,
        selector: (row) => row.id,
      },
      {
        name: "Tên người dùng",
        wrap: true,
        width: "180px",
        sortable: true,
        selector: (row) => row.user_id.name,
      },
      {
        name: "Số tiền rút",
        wrap: true,
        width: "130px",
        sortable: true,
        selector: (row) => (
          <span className="text-danger" style={{ fontWeight: "bold" }}>
            {formatter.format(row.cash)}
          </span>
        ),
      },
      {
        name: "Phương thức",
        wrap: true,
        sortable: true,
        width: "180px",
        selector: (row) => (
          <div>
            {row.type === 1 ? "Rút về Ngân hàng" : "Rút về tài khoản Momo"}
          </div>
        ),
      },

      {
        name: "Thời gian",
        selector: (row) => row.created_at,
        wrap: true,
        sortable: true,
        width: "180px",
        format: (row) => moment(row.created_at).format("DD/MM/YYYY, HH:mm:ss"),
      },

      {
        button: "true",
        width: "100px",
        cell: (row) => (
          <Button
            color="blue"
            onClick={() => {
              setOpenModal(true);
              setRequest(row);
            }}
            style={{ color: "white" }}
          >
            Chi tiết
          </Button>
        ),
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
          Yêu cầu rút tiền
        </h4>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="#"
                onClick={() => fetchData()}
                style={{ border: "1px solid gray" }}
                className="flex items-center rounded bg-white px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Làm mới
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
      <ModalDetail
        openModal={openModal}
        setOpenModal={setOpenModal}
        fetchData={fetchData}
        data={request}
      />
    </>
  );
};

export default PageComponent;
