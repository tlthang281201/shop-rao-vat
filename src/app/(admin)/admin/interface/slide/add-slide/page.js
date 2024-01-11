import AddSlideComponent from "@/app/(admin)/components/Slide/AddSlide";
import React from "react";
export async function generateMetadata() {
  return {
    title: `Thêm mới slide`,
  };
}
const AddSlidePage = () => {
  return <AddSlideComponent />;
};

export default AddSlidePage;
