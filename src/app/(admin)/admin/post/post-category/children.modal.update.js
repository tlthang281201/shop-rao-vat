import Switcher from "@/app/(admin)/components/Switchers/Switch";
import { supabaseAdmin } from "@/supabase/supabase-config";
import CreateSlug from "@/utilities/CreateSlug";
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
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
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    name: "",
    des: "",
    active: "",
    parent: "",
  });
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
    });
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
      })
      .eq("id", category.id);
    if (!error) {
      toast.success("Cập nhập thành công");
      setOpenModal(false);
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
      onClose={() => setOpenModal(false)}
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
