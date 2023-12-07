"use client";
import $ from "jquery";
import DataTable from "datatables.net-dt";

import Image from "next/image";
import "datatables.net-dt/css/jquery.dataTables.css";
import { useEffect, useRef } from "react";

const productData = [
  {
    image: "/images/product/product-01.png",
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    image: "/images/product/product-02.png",
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    image: "/images/product/product-03.png",
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const TableTwo = () => {
  useEffect(() => {
    $("#mytable").DataTable({ retrieve: true });
  }, []);

  return (
    // <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    //   <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
    //     <div className="col-span-3 flex items-center">
    //       <p className="font-medium">Hình ảnh</p>
    //     </div>
    //     <div className="col-span-2 hidden items-center sm:flex">
    //       <p className="font-medium">Tên danh mục</p>
    //     </div>
    //     <div className="col-span-1 flex items-center">
    //       <p className="font-medium">Trạng thái</p>
    //     </div>
    //     <div className="col-span-1 flex items-center">
    //       <p className="font-medium">Ngày tạo</p>
    //     </div>
    //     <div className="col-span-1 flex items-center">
    //       <p className="font-medium">Ngày cập nhập</p>
    //     </div>
    //   </div>

    //   {productData.map((product, key) => (
    //     <div
    //       className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    //       key={key}
    //     >
    //       <div className="col-span-3 flex items-center">
    //         <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    //           <div className="h-12.5 w-15 rounded-md">
    //             <Image
    //               src={product.image}
    //               width={60}
    //               height={50}
    //               alt="Product"
    //             />
    //           </div>
    //           <p className="text-sm text-black dark:text-white">
    //             {product.name}
    //           </p>
    //         </div>
    //       </div>
    //       <div className="col-span-2 hidden items-center sm:flex">
    //         <p className="text-sm text-black dark:text-white">
    //           {product.category}
    //         </p>
    //       </div>
    //       <div className="col-span-1 flex items-center">
    //         <p className="text-sm text-black dark:text-white">
    //           ${product.price}
    //         </p>
    //       </div>
    //       <div className="col-span-1 flex items-center">
    //         <p className="text-sm text-black dark:text-white">{product.sold}</p>
    //       </div>
    //       <div className="col-span-1 flex items-center">
    //         <p className="text-sm text-meta-3">${product.profit}</p>
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table id="mytable">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên danh mục</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhập</th>
            <th>Ngày bán</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product, key) => (
            <tr key={key}>
              <td>
                <Image
                  src={product.image}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.sold}</td>
              <td>{product.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableTwo;
