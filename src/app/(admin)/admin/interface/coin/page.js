import ListCoinComponent from "@/app/(admin)/components/coin/ListCoin";
import React from "react";
export async function generateMetadata() {
  return {
    title: `Bảng giá quy đổi đồng cũ`,
  };
}
const ListCoinPage = () => {
  return <ListCoinComponent />;
};

export default ListCoinPage;
