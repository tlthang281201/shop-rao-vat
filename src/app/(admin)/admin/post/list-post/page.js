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

const ListPost = () => {
  const [category, setCategory] = useState(null);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);

  const fetchData = async () => {
    const { data, error } = await getAllPost();
    setData(data);
    setPending(false);
    console.log(data);
  };

  supabase
    .channel("post")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "post" },
      fetchData
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "post" },
      fetchData
    )
    .subscribe();

  const updateNewStatus = async (id, status) => {
    const { error } = await supabase
      .from("category_parent")
      .update({ active: status })
      .eq("id", id);
    fetchData();
    if (error) {
      toast.error(`Lỗi ${error}`);
    }
  };

  const deleteById = async (id) => {
    const { error } = await supabase
      .from("category_parent")
      .delete()
      .eq("id", id);
    fetchData();
    if (!error) {
      toast.success("Xoá thành công");
    } else {
      toast.error("Lỗi! Hãy xoá danh mục con trước");
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
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.images[0]}`}
            width={120}
            height={50}
            style={{ height: "70px" }}
          />
        ),
      },
      {
        name: "Tên liên hệ",
        selector: (row) => row.fullname,
        sortable: true,
        wrap: true,
        width: "150px",
      },
      {
        name: "Điện thoại",
        selector: (row) => row.phone,
        sortable: true,
        wrap: true,
        width: "150px",
      },
      {
        name: "Chủ đề",
        selector: (row) => row.cate_c_id.name,
        sortable: true,
        wrap: true,
        width: "130px",
      },
      {
        name: "Tiêu đề",
        selector: (row) => row.title,
        sortable: true,
        wrap: true,
        width: "210px",
      },
      {
        name: "Tỉnh/thành",
        selector: (row) => row.city.name,
        sortable: true,
        wrap: true,
        width: "180px",
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
        selector: (row) => row.created_at,
        wrap: true,
        sortable: true,
        width: "220px",
        format: (row) => moment(row.created_at).format("DD/MM/YYYY, HH:mm:ss"),
      },

      {
        button: "true",
        cell: (row) => (
          <Link
            href={`/admin/post/edit-post/${row.id}`}
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
          <button onClick={() => deleteById(row.id)} className="text-danger">
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
          style={{ textTransform: "uppercase", fontSize: "20px" }}
        >
          Danh sách bài đăng
        </h4>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <button
                onClick={() => setOpenModalCreate(true)}
                type="button"
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
              </button>
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
    </>
  );
};

export default ListPost;
