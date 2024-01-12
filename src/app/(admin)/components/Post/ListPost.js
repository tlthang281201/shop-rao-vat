"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";
import moment from "moment";
import { supabase } from "@/supabase/supabase-config";
import { getAllPost } from "@/services/PostService";
import Image from "next/image";
import { formatter } from "@/utilities/utils";
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
      "&:nth-last-child(2)": {
        position: "sticky",
        right: "50px",
        backgroundColor: "#fff",
      },
      "&:nth-last-child(1)": {
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
      "&:nth-last-child(1)": {
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

const ListPostComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [post, setPost] = useState(null);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [id, setId] = useState("");

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("post")
      .select(
        `*,id,images,title,cate_c_id(name),price,city(name),district(name),ward(name),users(name),fullname,phone`
      )
      .match({ is_show: true, status: 1, is_sold: false, is_selling: false })
      .order("created_at", { ascending: false });
    setData(data);
    setPending(false);
  };

  const deleteById = async (id) => {
    const { error } = await supabase.from("post").delete().eq("id", id);
    fetchData();
    setId(null);
    if (!error) {
      toast.success("Xoá thành công");
    } else {
      toast.error(`Lỗi! ${error?.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = useMemo(
    () => [
      {
        name: "Hình ảnh",
        wrap: true,
        width: "120px",
        cell: (row) => (
          <div className="py-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.images[0]}`}
              width={120}
              height={90}
              style={{ height: "100px" }}
            />
          </div>
        ),
      },
      {
        name: "Người đăng",
        selector: (row) => row.users.name,
        sortable: true,
        wrap: true,
        width: "150px",
      },
      {
        name: "Điện thoại",
        selector: (row) => row.phone,
        sortable: true,
        wrap: true,
        width: "130px",
      },
      {
        name: "Danh mục",
        selector: (row) => row.cate_c_id.name,
        sortable: true,
        wrap: true,
        width: "110px",
      },
      {
        name: "Tiêu đề",
        selector: (row) => (
          <div className="flex flex-col">
            <span>{row.title}</span>
            <span className="text-danger mt-2">
              {row.is_featured ? "Tin nổi bật" : ""}
            </span>
          </div>
        ),
        sortable: true,
        wrap: true,
        width: "210px",
      },
      {
        name: "Giá tiền",
        selector: (row) => (
          <span className="text-danger" style={{ fontWeight: "bold" }}>
            {row.price ? formatter.format(row.price) : "Thoả thuận"}
          </span>
        ),
        sortable: true,
        wrap: true,
        width: "120px",
      },
      {
        name: "Tỉnh/thành",
        selector: (row) => row.city.name,
        sortable: true,
        wrap: true,
        width: "160px",
      },
      {
        name: "Quận/huyện",
        selector: (row) => row.district.name,
        sortable: true,
        wrap: true,
        width: "180px",
      },

      {
        name: "Ngày đăng",
        selector: (row) =>
          moment(row?.created_at).format("DD/MM/YYYY, HH:mm:ss"),
        wrap: true,
        sortable: true,
        width: "180px",
      },
      {
        button: "true",
        cell: (row) => (
          <button
            style={{ color: "green" }}
            onClick={() => {
              setOpenModal1(true);
              setPost(row);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          </button>
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
          Danh sách bài đăng đang hiển thị
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
              Bạn có chắc muốn xoá tin đăng này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
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

      <ModalDetail
        setOpenModal={setOpenModal1}
        openModal={openModal1}
        data={post}
      />
    </>
  );
};

export default ListPostComponent;
