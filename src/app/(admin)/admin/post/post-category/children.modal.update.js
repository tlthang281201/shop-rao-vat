import Switcher from "@/app/(admin)/components/Switchers/Switch";
import { supabaseAdmin } from "@/supabase/supabase-config";
import CreateSlug from "@/utilities/CreateSlug";
import upImage from "@/utilities/UpImageCategory";
import { getCookie } from "cookies-next";
import {
  Button,
  FileInput,
  Label,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UpdateChildrenModal = ({
  openModal,
  setOpenModal,
  fetchData,
  category,
  parentId,
  parentName,
}) => {
  const [id, setId] = useState("");
  const [categories, setCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    des: "",
    active: "",
    parent: "",
    image: "",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const fileName = await upImage(file);
      setData({
        ...data,
        image: `https://weeevlktjgkhinnqsmai.supabase.co/storage/v1/object/public/post_images/category/${fileName}`,
      });
      console.log(fileName);
    }
  };

  const getAllCategory = async () => {
    const res = await supabaseAdmin.from("category_parent").select();
    setCategories(res.data);
  };

  useEffect(() => {
    getAllCategory();
    setData({
      name: category?.name,
      des: category?.description,
      active: category?.active,
      parent: parentId,
      image: category?.image,
    });
    const admin = JSON.parse(getCookie("admin"));
    setId(admin.id);
  }, [category]);

  const [errors, setErrors] = useState({ name: null, des: null });
  const handleSubmit = async () => {
    if (!data.name) {
      return;
    }
    var name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    var slug = CreateSlug(name);
    const { error } = await supabaseAdmin
      .from("category_children")
      .update({
        name: name,
        slug: slug,
        description: data.des,
        active: data.active,
        parent: data.parent,
        updated_at: new Date(),
        updated_by: id,
        image: data.image,
      })
      .eq("id", category.id);
    if (!error) {
      toast.success("Cập nhập thành công");
      setOpenModal(false);
      setImage(null);
    } else {
      if (error?.message.includes("duplicate")) {
        toast.error("Lỗi! Trùng tên danh mục");
      } else {
        toast.error(error?.message);
      }
    }
  };
  const validateInput = (val) => {
    let reg = /^[\S]+(?: [\S]+)*$/;
    let name = val.replace(/\s/g, "");
    if (reg.test(val) && name.length > 3) {
      setData({ ...data, name: val });
      setErrors({ ...errors, name: null });
    } else {
      setData({ ...data, name: null });
      setErrors({ ...errors, name: "Tên danh mục ít nhất 4 kí tự" });
    }
  };

  return (
    <Modal
      style={{ zIndex: 99999 }}
      show={openModal}
      size="md"
      onClose={() => {
        setOpenModal(false);
        setImage(null);
      }}
    >
      <Modal.Header>Cập nhập mục</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Danh mục gốc" />
            </div>
            <Select
              onChange={(e) => setData({ ...data, parent: e.target.value })}
              value={data.parent}
            >
              {categories?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Tên danh mục" />
            </div>
            <TextInput
              id="name"
              onChange={(e) => validateInput(e.target.value)}
              placeholder="Tên danh mục"
              type="text"
              value={data.name}
            />
            {errors.name ? (
              <span className="text-danger" style={{ fontSize: "13px" }}>
                {errors.name}
              </span>
            ) : (
              ""
            )}
          </div>

          <div>
            <div>
              <div className="flex w-full items-center flex-row justify-between">
                <Label>Hình ảnh</Label>
                <Label
                  htmlFor="dropzone-file"
                  style={{
                    border: "1px solid black",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    backgroundColor: "#FF5757",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="flex flex-row items-center p-2 gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <span>Chọn hình ảnh</span>
                  <FileInput
                    onChange={handleFileChange}
                    id="dropzone-file"
                    accept="image/*"
                    className="hidden"
                  />
                </Label>
              </div>
              {image ? (
                <div className="mt-2">
                  <Image
                    priority={true}
                    src={URL.createObjectURL(image)}
                    width={100}
                    height={100}
                    alt="Selected"
                    style={{ position: "relative" }}
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <Image
                    priority={true}
                    src={data?.image}
                    width={100}
                    height={100}
                    alt="Selected"
                    style={{ position: "relative" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="des" value="Mô tả" />
            </div>
            <Textarea
              id="des"
              placeholder="Mô tả danh mục.."
              onChange={(e) => setData({ ...data, des: e.target.value })}
              rows={4}
              value={data.des ? data.des : ""}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {/* <Checkbox id="remember" /> */}
              <Label style={{ marginRight: "15px" }} htmlFor="remember">
                Hiển thị
              </Label>
              <Switcher
                enabled={data.active}
                onChange={() => setData({ ...data, active: !data.active })}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <div></div>
            <Button color="success" onClick={() => handleSubmit()}>
              Cập nhập
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateChildrenModal;
