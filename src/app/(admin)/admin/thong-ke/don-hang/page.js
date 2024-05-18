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

const Order = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [type, setType] = useState("day");
  const fetchData = async () => {
    setPending(true);
    if (type === "day") {
      const { data } = await supabase
        .from("thong_ke_don_hang")
        .select()
        .order("time", { ascending: false });
      setData(data);
      setPending(false);
    } else if (type === "month") {
      const { data } = await supabase
        .from("thong_ke_don_hang_thang")
        .select()
        .order("time", { ascending: false });
      setData(data);
      setPending(false);
    }
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  useEffect(() => {
    fetchData();
  }, [type]);
  const columns = useMemo(
    () => [
      {
        name: "Thời gian",
        selector: (row) => moment(row?.time).format("DD/MM/YYYY"),
        sortable: true,
        wrap: true,
        width: "170px",
      },

      {
        name: "Tổng số đơn hàng đã giao",
        selector: (row) => row?.sodon,
        sortable: true,
        wrap: true,
        width: "250px",
      },

      {
        name: "Tổng giá trị",
        selector: (row) => (
          <span style={{ fontWeight: "bold", color: "red" }}>
            {formatter.format(row?.tong)}
          </span>
        ),
        sortable: true,
        wrap: true,
        width: "170px",
      },
    ],
    []
  );
  const columns2 = useMemo(
    () => [
      {
        name: "Thời gian",
        selector: (row) => moment(row?.time).format("MM/YYYY"),
        sortable: true,
        wrap: true,
        width: "170px",
      },

      {
        name: "Tổng số đơn hàng đã giao",
        selector: (row) => row?.sodon,
        sortable: true,
        wrap: true,
        width: "250px",
      },

      {
        name: "Tổng giá trị",
        selector: (row) => (
          <span style={{ fontWeight: "bold", color: "red" }}>
            {formatter.format(row?.tong)}
          </span>
        ),
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
          Thống kê đơn hàng
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>Thống kê theo</li>
            <li>
              <select onChange={(e) => setType(e.target.value)}>
                <option value={"day"}>Ngày</option>
                <option value={"month"}>Tháng</option>
              </select>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col gap-10">
        <DataTable
          columns={type === "day" ? columns : columns2}
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

export default Order;
