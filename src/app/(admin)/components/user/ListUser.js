"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";
import { getAllCategory } from "@/services/CategoryService";
import moment from "moment/moment";
import { supabase, supabaseAdmin } from "@/supabase/supabase-config";
import { getAllUser } from "@/services/UsersService";
import Link from "next/link";
import { Button, Modal } from "flowbite-react";

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
  rowsPerPageText: "Số hàng mỗi trang",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Tất cả",
};

const ListUserComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);

  const fetchData = async () => {
    const { data } = await getAllUser();
    setData(data);
    setPending(false);
  };

  const updateNewStatus = async (id, status) => {
    const { error } = await supabase
      .from("users")
      .update({ active: status })
      .eq("id", id);
    const res = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { active: status },
    });
    console.log(res);
    fetchData();
    if (error) {
      toast.error(`Lỗi ${error}`);
    }
  };

  const deleteById = async (id) => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    const res = await supabaseAdmin.auth.admin.deleteUser(id);
    setOpenModal(false);
    setId(null);
    fetchData();
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
        name: "Họ và tên",
        selector: (row) => row.name,
        sortable: true,
        wrap: true,
        width: "170px",
      },
      {
        name: "Điện thoại",
        selector: (row) => (
          <div>
            {row.phone ? (
              row.phone
            ) : (
              <span style={{ color: "red" }}>Chưa cập nhập</span>
            )}
          </div>
        ),
        wrap: true,
        width: "130px",
      },

      {
        name: "Thành phố",
        selector: (row) => (
          <div>
            {row.city?.name ? (
              row.city?.name
            ) : (
              <span style={{ color: "red" }}>Chưa cập nhập</span>
            )}
          </div>
        ),
        wrap: true,
        sortable: true,
        width: "180px",
      },
      {
        name: "Quận/huyện",
        selector: (row) => (
          <div>
            {row.district?.name ? (
              row.district?.name
            ) : (
              <span style={{ color: "red" }}>Chưa cập nhập</span>
            )}
          </div>
        ),
        wrap: true,
        sortable: true,
        width: "160px",
      },
      {
        name: "Phường/Xã",
        selector: (row) => (
          <div>
            {row.ward?.name ? (
              row.ward?.name
            ) : (
              <span style={{ color: "red" }}>Chưa cập nhập</span>
            )}
          </div>
        ),
        wrap: true,
        sortable: true,
        width: "160px",
      },
      {
        name: "Hoạt động",
        button: "true",
        cell: (row) =>
          row.active ? (
            <a
              href="#"
              className="text-success"
              onClick={() => updateNewStatus(row.id, false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          ) : (
            <a
              href="#"
              className="text-danger"
              onClick={() => updateNewStatus(row.id, true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          ),
      },

      {
        button: "true",
        cell: (row) => (
          <a
            href="#"
            onClick={() => {
              setId(row.id);
              setOpenModal(true);
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
          </a>
        ),
        width: "50px",
      },
    ],
    []
  );
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className="text-title-md2 font-semibold text-black dark:text-white"
          style={{
            textTransform: "uppercase",
            fontSize: "20px",
            color: "rgb(28 36 52)",
          }}
        >
          Danh sách người dùng
        </h2>
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
        <DataTable
          columns={columns}
          progressPending={pending}
          progressComponent={<Loading />}
          data={data}
          customStyles={customStyles}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          persistTableHead
          noDataComponent={
            <span className="text-danger pt-10">Không tìm thấy dữ liệu</span>
          }
        />
      </div>

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
              Bạn có chắc chắn muốn xoá người dùng này?
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
    </>
  );
};

export default ListUserComponent;
