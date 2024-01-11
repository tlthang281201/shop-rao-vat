import ListSlide from "@/app/(admin)/components/Slide/ListSlide";
import React from "react";
export async function generateMetadata() {
  return {
    title: `Danh sách slide`,
  };
}
const ListSlidePage = () => {
  return <ListSlide />;
};

export default ListSlidePage;
