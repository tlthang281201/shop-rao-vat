"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";
import moment from "moment/moment";
import { supabase, supabaseAdmin } from "@/supabase/supabase-config";
import { getAllOrder } from "@/services/OrderService";

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

const ListOrder = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);

  const fetchData = async () => {
    const { data } = await getAllOrder();
    setData(data);
    setPending(false);
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  useEffect(() => {
    fetchData();
  }, []);
  const columns = useMemo(
    () => [
      {
        name: "Người mua",
        selector: (row) => row?.buyer_id?.name,
        sortable: true,
        wrap: true,
        width: "170px",
      },
      {
        name: "Số điện thoại",
        selector: (row) => row?.phone,
        sortable: true,
        wrap: true,
        width: "150px",
      },
      {
        name: "Người bán",
        selector: (row) => row?.seller_id?.name,
        sortable: true,
        wrap: true,
        width: "170px",
      },
      {
        name: "Số điện thoại",
        selector: (row) => row?.post_id?.phone,
        sortable: true,
        wrap: true,
        width: "150px",
      },
      {
        name: "Bài đăng",
        selector: (row) => row?.post_id?.title,
        sortable: true,
        wrap: true,
        width: "220px",
      },
      {
        name: "Giá tiền",
        selector: (row) => (
          <span style={{ fontWeight: "bold", color: "red" }}>
            {row?.post_id?.price
              ? formatter.format(row?.post_id?.price)
              : "Thoả thuận"}
          </span>
        ),
        sortable: true,
        wrap: true,
        width: "170px",
      },
      {
        name: "Ngày đặt",
        selector: (row) =>
          moment(row.created_at).format("DD/MM/YYYY, HH:mm:ss"),
        sortable: true,
        wrap: true,
        width: "170px",
      },
      {
        name: "Trạng thái",
        selector: (row) =>
          row.status === 0
            ? "Chưa xác nhận"
            : row.status === 1
            ? "Đã xác nhận"
            : row.status === 2
            ? "Đang giao"
            : row.status === 3
            ? "Đã giao"
            : "Từ chối",
        sortable: true,
        wrap: true,
        width: "170px",
      },
    ],
    []
  );
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Danh sách đơn hàng
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li></li>
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

export default ListOrder;
