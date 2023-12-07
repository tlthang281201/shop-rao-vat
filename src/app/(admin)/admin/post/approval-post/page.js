import TableTwo from "../../../components/Tables/TableTwo";

export const metadata = {
  title: "Duyệt bài đăng",
  // other metadata
};

const ApprovalPost = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Bài đăng chờ duyệt
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        <TableTwo />
      </div>
    </>
  );
};

export default ApprovalPost;
