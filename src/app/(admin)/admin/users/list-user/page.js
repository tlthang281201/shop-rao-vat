import ListUserComponent from "@/app/(admin)/components/user/ListUser";
import React from "react";
export async function generateMetadata() {
  return {
    title: `Danh sách người dùng`,
  };
}
const ListUserPage = () => {
  return <ListUserComponent />;
};

export default ListUserPage;
