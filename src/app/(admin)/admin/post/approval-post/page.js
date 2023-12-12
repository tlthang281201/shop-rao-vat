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
      "&:nth-last-child(3)": {
        position: "sticky",
        right: "50px",
        backgroundColor: "#fff",
      },
      "&:nth-last-child(2)": {
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
      "&:nth-last-child(3)": {
        position: "sticky",
        right: "50px",
        backgroundColor: "#fff",
      },
      "&:nth-last-child(2)": {
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

const ApprovalPost = () => {
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
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
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
              <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
            </svg>
          </button>
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
          Duyệt bài đăng
        </h4>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              {/* <button
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
              </button> */}
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

export default ApprovalPost;
