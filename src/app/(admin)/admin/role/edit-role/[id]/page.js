"use client";
import { supabaseAdmin } from "@/supabase/supabase-config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";

const EditRole = ({ params }) => {
  const [state, setState] = useState({ loading: true, error: null });
  const [data, setData] = useState({ roleName: null, description: null });
  const [permissions, setPermissions] = useState({
    viewSlide: false,
    addSlide: false,
    editSlide: false,
    deleteSlide: false,
    viewUser: false,
    editUser: false,
    deleteUser: false,
    viewPCate: false,
    addPCate: false,
    editPCate: false,
    deletePCate: false,
    viewPost: false,
    addPost: false,
    editPost: false,
    deletePost: false,
  });
  const checkRole = (data, key) => {
    if (data[0].permission.includes(key)) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabaseAdmin
        .from("role")
        .select()
        .eq("id", params.id);
      if (data.length > 0) {
        setData({ roleName: data[0].name, description: data[0].desc });
        setState({ ...state, loading: false });
        setPermissions({
          ...permissions,
          viewSlide: checkRole(data, "viewSlide") ? true : false,
          addSlide: checkRole(data, "addSlide") ? true : false,
          editSlide: checkRole(data, "editSlide") ? true : false,
          deleteSlide: checkRole(data, "deleteSlide") ? true : false,
          viewUser: checkRole(data, "viewUser") ? true : false,
          editUser: checkRole(data, "editUser") ? true : false,
          deleteUser: checkRole(data, "deleteUser") ? true : false,
          viewPCate: checkRole(data, "viewPCate") ? true : false,
          addPCate: checkRole(data, "addPCate") ? true : false,
          editPCate: checkRole(data, "editPCate") ? true : false,
          deletePCate: checkRole(data, "deletePCate") ? true : false,
          viewPost: checkRole(data, "viewPost") ? true : false,
          addPost: checkRole(data, "addPost") ? true : false,
          editPost: checkRole(data, "editPost") ? true : false,
          deletePost: checkRole(data, "deletePost") ? true : false,
        });
      } else {
        setState({
          loading: false,
          error: "Lỗi! Không tìm thấy dữ liệu. Vui lòng kiểm tra lại id",
        });
      }
    };
    fetchData();
  }, [params.id]);

  const [allPerm, setAllPerm] = useState({
    perm1: false,
    perm2: false,
    perm3: false,
    perm4: false,
  });

  const router = useRouter();

  const validateRole = (value) => {
    let regex = /^[\S]+(?: [\S]+)*$/;
    let res = regex.test(value);
    let name = value.replace(/\s/g, "");
    if (res && name.length > 1) {
      setData({ ...data, roleName: value.toUpperCase() });
    } else {
      setData({ ...data, roleName: null });
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissions({
      ...permissions,
      [name]: checked,
    });
    if (name.includes("Slide") && allPerm.perm1) {
      setAllPerm({
        ...allPerm,
        perm1: false,
      });
    } else if (name.includes("User") && allPerm.perm2) {
      setAllPerm({
        ...allPerm,
        perm2: false,
      });
    } else if (name.includes("PCate") && allPerm.perm3) {
      setAllPerm({
        ...allPerm,
        perm3: false,
      });
    } else if (name.includes("Post") && allPerm.perm4) {
      setAllPerm({
        ...allPerm,
        perm4: false,
      });
    }
  };

  const handleCheckboxAll = (event) => {
    const { name, checked } = event.target;
    setAllPerm({
      ...allPerm,
      [name]: checked,
    });
    if (checked && name === "perm1") {
      setPermissions({
        ...permissions,
        viewSlide: true,
        addSlide: true,
        editSlide: true,
        deleteSlide: true,
      });
    } else if (checked && name === "perm2") {
      setPermissions({
        ...permissions,
        viewUser: true,
        editUser: true,
        deleteUser: true,
      });
    } else if (checked && name === "perm3") {
      setPermissions({
        ...permissions,
        viewPCate: true,
        addPCate: true,
        editPCate: true,
        deletePCate: true,
      });
    } else if (checked && name === "perm4") {
      setPermissions({
        ...permissions,
        viewPost: true,
        addPost: true,
        editPost: true,
        deletePost: true,
      });
    }

    if (!checked && name === "perm1") {
      setPermissions({
        ...permissions,
        viewSlide: false,
        addSlide: false,
        editSlide: false,
        deleteSlide: false,
      });
    } else if (!checked && name === "perm2") {
      setPermissions({
        ...permissions,
        viewUser: false,
        editUser: false,
        deleteUser: false,
      });
    } else if (!checked && name === "perm3") {
      setPermissions({
        ...permissions,
        viewPCate: false,
        addPCate: false,
        editPCate: false,
        deletePCate: false,
      });
    } else if (!checked && name === "perm4") {
      setPermissions({
        ...permissions,
        viewPost: false,
        addPost: false,
        editPost: false,
        deletePost: false,
      });
    }
  };

  const handleSubmit = async () => {
    if (!data.roleName) {
      toast.error("Vui lòng nhập đúng cú pháp");
      return;
    }
    var str = "";
    Object.entries(permissions).forEach(([permission, value]) => {
      if (value) {
        str = str + permission + "|";
      }
    });
    const { error } = await supabaseAdmin
      .from("role")
      .update({ name: data.roleName, desc: data.description, permission: str })
      .eq("id", params.id);
    if (!error) {
      toast.success("Cập nhập thành công");
      router.back();
    } else {
      if (error?.message.includes("duplicate")) {
        toast.error("Lỗi! Trùng tên vai trò");
      } else {
        toast.error(error?.message);
      }
    }
  };

  return (
    <>
      {state.loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : state.error ? (
        <div className="flex justify-center">
          <span className="text-danger">{state.error}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cập nhập quyền truy cập
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Tên vai trò
                  </label>
                  <input
                    type="text"
                    value={data.roleName}
                    onChange={(e) => validateRole(e.target.value)}
                    style={{ textTransform: "uppercase" }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phân quyền theo chức năng
                </label>
                <div className="flex flex-col overflow-x-auto">
                  <div className="">
                    <div className="inline-block min-w-full py-2 ">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm font-light">
                          <thead
                            className="border-b font-medium dark:border-neutral-500 text-white text-center"
                            style={{ backgroundColor: "rgb(38 38 38)" }}
                          >
                            <tr>
                              <th scope="col" className="px-6 py-4">
                                #
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Tất cả
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Xem
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Thêm
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Sửa
                              </th>
                              <th scope="col" className="px-6 py-4">
                                Xoá
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b dark:border-neutral-500 text-center">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-black ">
                                Giao diện slide
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="perm1"
                                  checked={allPerm.perm1}
                                  onChange={handleCheckboxAll}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="viewSlide"
                                  checked={permissions.viewSlide}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="addSlide"
                                  checked={permissions.addSlide}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="editSlide"
                                  checked={permissions.editSlide}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="deleteSlide"
                                  checked={permissions.deleteSlide}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                            </tr>
                            <tr className="border-b dark:border-neutral-500 text-center">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-black ">
                                Quản lý người dùng
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="perm2"
                                  checked={allPerm.perm2}
                                  onChange={handleCheckboxAll}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="viewUser"
                                  checked={permissions.viewUser}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4"></td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="editUser"
                                  checked={permissions.editUser}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="deleteUser"
                                  checked={permissions.deleteUser}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                            </tr>

                            <tr className="border-b dark:border-neutral-500 text-center">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-black ">
                                Danh mục bài đăng
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="perm3"
                                  checked={allPerm.perm3}
                                  onChange={handleCheckboxAll}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="viewPCate"
                                  checked={permissions.viewPCate}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="addPCate"
                                  checked={permissions.addPCate}
                                  style={{ borderRadius: "3px" }}
                                  onChange={handleCheckboxChange}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="editPCate"
                                  checked={permissions.editPCate}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="deletePCate"
                                  checked={permissions.deletePCate}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                            </tr>
                            <tr className="border-b dark:border-neutral-500 text-center">
                              <td className="whitespace-nowrap px-6 py-4 font-medium text-black ">
                                Quản lý bài đăng
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="perm4"
                                  checked={allPerm.perm4}
                                  onChange={handleCheckboxAll}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="viewPost"
                                  checked={permissions.viewPost}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="addPost"
                                  checked={permissions.addPost}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="editPost"
                                  checked={permissions.editPost}
                                  onChange={handleCheckboxChange}
                                  style={{ borderRadius: "3px" }}
                                />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <input
                                  type="checkbox"
                                  name="deletePost"
                                  checked={permissions.deletePost}
                                  style={{ borderRadius: "3px" }}
                                  onChange={handleCheckboxChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSubmit()}
                className="flex  justify-center rounded bg-primary p-3 font-medium text-white"
              >
                Cập nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRole;
