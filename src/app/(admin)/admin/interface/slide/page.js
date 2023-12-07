import TableTwo from "../../../components/Tables/TableTwo";

export const metadata = {
  title: "Chỉnh sửa slide",
  // other metadata
};

const ListSlide = () => {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Danh mục tin tức
        </h2>
        <button
          type="button"
          className="flex items-center rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white hover:bg-primary-600 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Thêm mới
        </button>
      </div>

      <div className="flex flex-col gap-10">
        <TableTwo />
      </div>
    </>
  );
};

export default ListSlide;
