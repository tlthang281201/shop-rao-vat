import React from "react";
import PageComponent from "./PageComponent";
export async function generateMetadata() {
  return {
    title: `Yêu cầu rút tiền`,
  };
}
const WithdrawRequest = () => {
  return <PageComponent />;
};

export default WithdrawRequest;
