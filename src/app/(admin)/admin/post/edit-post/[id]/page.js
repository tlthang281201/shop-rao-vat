"use client";
import { supabaseAdmin } from "@/supabase/supabase-config";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { FileInput, Label, Spinner } from "flowbite-react";
import Switcher from "@/app/(admin)/components/Switchers/Switch";
import CurrencyInput from "react-currency-input-field";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import upImage from "@/utilities/UploadImage";
import { addPost } from "@/services/PostService";

const EditPost = () => {
  const editorRef = useRef(null);
  const maxFileSize = 5 * 1024 * 1024;
  const [errors, setErrors] = useState({ des: null, image: null });
  const [isPrice, setIsPrice] = useState(true);
  const [loading, setLoading] = useState({
    ccate: false,
    district: false,
    ward: false,
    image: false,
  });
  const [data, setData] = useState({
    title: "",
    pcid: "",
    ccid: "",
    price: isPrice ? "" : null,
    city: "",
    district: "",
    ward: "",
    address: "",
    description: "",
    name: "",
    phone: "",
    is_new: "",
    image: [],
    seller_id: 1,
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [categories, setCategories] = useState({ parent: [], children: [] });
  const [address, setAddress] = useState({ city: [], district: [], ward: [] });
  const fetchCategory = async () => {
    const { data, errors } = await supabaseAdmin
      .from("category_parent")
      .select()
      .eq("active", true);
    setCategories({ ...categories, parent: data });
  };

  const fetchCity = async () => {
    const { data, errors } = await supabaseAdmin.from("city").select();
    setAddress({ ...address, city: data });
  };

  const fetchDistrict = async (id) => {
    setLoading({ ...loading, district: true });
    const { data, errors } = await supabaseAdmin
      .from("district")
      .select()
      .eq("city_id", id);
    setAddress({ ...address, district: data });
    setLoading({ ...loading, district: false });
  };

  const fetchWard = async (id) => {
    setLoading({ ...loading, ward: true });
    const { data, errors } = await supabaseAdmin
      .from("ward")
      .select()
      .eq("district_id", id);
    setAddress({ ...address, ward: data });
    setLoading({ ...loading, ward: false });
  };

  const fetchChildrenCategory = async (id) => {
    setLoading({ ...loading, ccate: true });
    const { data, errors } = await supabaseAdmin
      .from("category_children")
      .select()
      .match({ parent: id, active: true });
    setCategories({ ...categories, children: data });
    setLoading({ ...loading, ccate: false });
  };

  const checkValidDescription = (content) => {
    var numChars =
      tinymce.activeEditor.plugins.wordcount.body.getCharacterCount();
    if (numChars < 30 || numChars > 1000) {
      setErrors((prev) => ({
        ...prev,
        des: "Mô tả là trường bắt buộc, mô tả ít nhất 30 kí tự và không quá 1000 kí tự",
      }));
    } else {
      setData((prev) => ({ ...prev, description: content }));
      setErrors((prev) => ({
        ...prev,
        des: null,
      }));
    }
  };

  const uploadImage = async (file) => {
    const fileName = await upImage(file);
    setData((prevData) => ({
      ...prevData,
      image: [...prevData.image, fileName],
    }));
    setSelectedFile((prevFiles) => [...prevFiles, file]);
    setLoading((prev) => ({
      ...prev,
      image: false,
    }));
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setLoading((prev) => ({
      ...prev,
      image: true,
    }));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxFileSize) {
        setErrors((prev) => ({
          ...prev,
          image: `File "${file.name}" vượt quá dung lượng cho phép.`,
        }));
      } else if (
        selectedFile.length > 6 ||
        files.length > 6 ||
        selectedFile.length + files.length > 6
      ) {
        setErrors((prev) => ({
          ...prev,
          image: `Chọn tối đa 6 ảnh.`,
        }));
      } else if (
        selectedFile.some((selectedFile) => selectedFile.name === file.name)
      ) {
        setErrors((prev) => ({
          ...prev,
          image: `Ảnh đã được chọn`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          image: null,
        }));
        uploadImage(file);
      }
    }
    setLoading((prev) => ({
      ...prev,
      image: false,
    }));
  };

  const removeImage = async (indexToRemove) => {
    setLoading((prev) => ({
      ...prev,
      image: true,
    }));
    const updatedFiles = selectedFile.filter(
      (file, index) => index !== indexToRemove
    );
    const fileNameRemove = data.image[indexToRemove];
    const res = await supabaseAdmin.storage
      .from("post_images")
      .remove([`public/${fileNameRemove}`]);
    setLoading((prev) => ({
      ...prev,
      image: false,
    }));
    const images = data.image.filter((file, index) => index !== indexToRemove);
    setData((prevData) => ({
      ...prevData,
      image: images,
    }));
    setSelectedFile(updatedFiles);
  };

  async function createInvoice(formData) {
    // const rawFormData = {
    //   pcid: formData.get("pcid"),
    //   ccid: formData.get("ccid"),
    //   price: formData.get("price"),
    // };
    if (data.image.length === 0) {
      setErrors((prev) => ({
        ...prev,
        image: "Vui lòng chọn ít nhất 1 file",
      }));
    } else {
      const res = await addPost(data);
      console.log(res);
      alert("Thành công");
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchCity();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Chỉnh sửa bài đăng
            </h3>
          </div>
          <form action={createInvoice}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Chọn danh mục (<span className="text-danger">*</span>)
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      onChange={(e) => {
                        setData({ ...data, pcid: e.target.value });
                        fetchChildrenCategory(e.target.value);
                      }}
                      required
                      name="pcid"
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      {categories?.parent?.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ padding: "5px" }}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Chọn nhóm (<span className="text-danger">*</span>)
                  </label>
                  <select
                    name="ccid"
                    value={data.ccid}
                    disabled={loading.ccate}
                    onChange={(e) => setData({ ...data, ccid: e.target.value })}
                    className="relative disabled:cursor-not-allowed disabled:bg-stroke z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    required
                  >
                    <option hidden value={""}>
                      --- Chọn nhóm ---
                    </option>
                    {categories?.children?.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        style={{ padding: "5px" }}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Trạng thái sản phẩm (<span className="text-danger">*</span>)
                  </label>
                  <select
                    name="ccid"
                    value={data.is_new}
                    onChange={(e) =>
                      setData({ ...data, is_new: e.target.value })
                    }
                    className="relative disabled:cursor-not-allowed disabled:bg-stroke z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    required
                  >
                    <option hidden value={""}>
                      --- Chọn ---
                    </option>
                    <option key={1} value={1} style={{ padding: "5px" }}>
                      Đã sử dụng
                    </option>
                    <option key={0} value={0} style={{ padding: "5px" }}>
                      Mới
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Tiêu đề (<span className="text-danger">*</span>)
                  </label>
                  <input
                    type="text"
                    required
                    value={data.title}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    minLength={10}
                    name="title"
                    placeholder="Tiêu đề bài đăng"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div
                className="mb-4.5 flex flex-col gap-6 xl:flex-row"
                style={{ alignItems: "center" }}
              >
                <div className="w-full  xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Giá (<span className="text-danger">*</span>)
                  </label>

                  <CurrencyInput
                    required={isPrice ? true : false}
                    name="price"
                    suffix={" đ"}
                    value={data.price}
                    allowDecimals={false}
                    allowNegativeValue={false}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary  disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onValueChange={(value) => {
                      setIsPrice(true);
                      setData({ ...data, price: value });
                    }}
                  />
                </div>
                <div
                  className="w-full mt-8 xl:w-1/3"
                  style={{ alignItems: "center" }}
                >
                  <input
                    type="radio"
                    id="isprice"
                    onChange={() => {
                      setIsPrice(false);
                      setData({ ...data, price: "" });
                    }}
                    checked={!isPrice}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <label
                    htmlFor="isprice"
                    className=" text-black dark:text-white ml-2"
                  >
                    Giá thương lượng
                  </label>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Địa chỉ (<span className="text-danger">*</span>)
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      onChange={(e) => {
                        setData({ ...data, city: e.target.value });
                        fetchDistrict(e.target.value);
                      }}
                      required
                      name={"city"}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      {address?.city?.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ padding: "5px" }}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Quận huyện (<span className="text-danger">*</span>)
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      name="district"
                      value={data.district}
                      disabled={loading.district}
                      onChange={(e) => {
                        setData({ ...data, district: e.target.value });
                        fetchWard(e.target.value);
                      }}
                      className="relative disabled:cursor-not-allowed disabled:bg-stroke z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      required
                    >
                      <option hidden value={""}>
                        --- Chọn quận huyện ---
                      </option>
                      {address?.district?.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ padding: "5px" }}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full xl:w-1/3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phường / Xã (<span className="text-danger">*</span>)
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      name="ward"
                      value={data.ward}
                      disabled={loading.ward}
                      onChange={(e) => {
                        setData({ ...data, ward: e.target.value });
                      }}
                      className="relative disabled:cursor-not-allowed disabled:bg-stroke z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      required
                    >
                      <option hidden value={""}>
                        --- Chọn phường xã ---
                      </option>
                      {address?.ward?.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ padding: "5px" }}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <input
                    type="text"
                    required
                    name="address"
                    value={data.address}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    placeholder="Số nhà, tên đường"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Thông tin liên hệ (<span className="text-danger">*</span>)
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Tên liên hệ"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Số điện thoại (<span className="text-danger">*</span>)
                  </label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={data.phone}
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                    placeholder="Số điện thoại"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Hình ảnh (<span className="text-danger">*</span>)
                  </label>
                  <div
                    className="w-full flex"
                    style={{ flexWrap: "wrap", alignItems: "center" }}
                  >
                    {selectedFile.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "100px",
                          height: "100px",
                          float: "left",
                          margin: "0 20px 35px 0",
                          background: "#FFFFFF",
                          border: "1px solid #D5D5D5",
                          cursor: "move",
                          borderRadius: "5px",
                        }}
                      >
                        <Image
                          alt={index + 1}
                          key={index}
                          style={{
                            position: "absolute",
                            display: "block",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                          }}
                          src={URL.createObjectURL(file)}
                          width={50}
                          height={50}
                        />
                        <a
                          onClick={() => removeImage(index)}
                          href="#"
                          style={{
                            position: "absolute",
                            zIndex: 2,
                            width: "20px",
                            height: "20px",
                            top: 0,
                            right: 0,
                            fontSize: "14px",
                            lineHeight: "20px",
                            padding: 0,
                            color: "gray",
                            backgroundColor: "rgba(225, 225, 225, 0.1)",
                            textAlign: "center",
                            borderRadius: "0 0 0 2px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                    ))}
                    {loading.image && (
                      <Spinner
                        color="success"
                        style={{ margin: "0 20px 35px 0" }}
                        size="lg"
                      />
                    )}
                  </div>
                  <Label
                    htmlFor="dropzone-file"
                    className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Chọn ảnh để tải lên
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lưu ý: Số lượng tối đa là 6 ảnh, định dạng ảnh hỗ trợ:
                        JPG, JPEG, PNG
                      </p>
                    </div>
                    <FileInput
                      id="dropzone-file"
                      name="image"
                      disabled={loading.image}
                      className="hidden"
                      accept="image/png, image/jpg, image/jpeg"
                      multiple
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Label>
                  {errors.image && (
                    <span className="text-danger">{errors.image}</span>
                  )}
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mô tả chi tiết (<span className="text-danger">*</span>)
                  </label>
                  <Editor
                    apiKey="1q9rjamh7noaeyfgaccykoxra3rna2v9p4byz9yios24igux"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue="Nhập mô tả sản phẩm, thông tin chi tiết"
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: "wordcount",
                      toolbar:
                        "undo redo  | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist | wordcount",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:15px }",
                    }}
                    onEditorChange={(content) => {
                      checkValidDescription(content);
                    }}
                  />
                </div>
              </div>

              {errors.des && <span className="text-danger">{errors.des}</span>}
              {/* <div
                className="mb-4.5 flex flex-row gap-6 xl:flex-row"
                style={{ alignItems: "center" }}
              >
                <label className=" text-black dark:text-white">Hoạt động</label>
                <Switcher
                  enabled={data.active}
                  onChange={() => setData({ ...data, active: !data.active })}
                />
              </div> */}

              <button
                type="submit"
                disabled={errors.des ? true : false}
                className="flex justify-center rounded bg-primary p-3 mt-5 font-medium text-white disabled:cursor-not-allowed"
              >
                Cập nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
