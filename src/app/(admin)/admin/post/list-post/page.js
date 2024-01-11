import ListPostComponent from "@/app/(admin)/components/Post/ListPost";
import React from "react";
export async function generateMetadata() {
  return {
    title: `Danh sách tin đăng`,
  };
}
const ListPostPage = () => {
  return <ListPostComponent />;
};

export default ListPostPage;
