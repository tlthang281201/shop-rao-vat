"use client";
import { supabaseAdmin } from "@/supabase/supabase-config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "@/app/(admin)/components/common/Loading";

import Switcher from "@/app/(admin)/components/Switchers/Switch";
import * as crypto from "crypto-js";
import { updateAccount } from "@/services/AccountAdminService";

const EditAccount = ({ params }) => {
  const [state, setState] = useState({ loading: true, error: null });
  const [errors, setErrors] = useState({
    name: null,
    phone: null,
    email: null,
    password: null,
  });
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);
  const [data, setData] = useState({
    name: null,
    email: null,
    phone: null,
    password: null,
    birthday: null,
    address: null,
    role: null,
    active: null,
  });
  const fetchData = async () => {
    const accountData = await supabaseAdmin
      .from("account_admin")
      .select()
      .eq("id", params.id);
    if (accountData.data.length > 0) {
      const roleData = await supabaseAdmin.from("role").select();
      setData({
        ...data,
        active: accountData.data[0].active,
        name: accountData.data[0].name,
        email: accountData.data[0].email,
        phone: accountData.data[0].phone,
        password: accountData.data[0].password,
        address: accountData.data[0].address,
        role: accountData.data[0].role_id,
      });
      setRole(roleData.data);
      setState({ ...state, loading: false });
    } else {
      setState({
        loading: false,
        error: "Lỗi! Không tìm thấy dữ liệu. Vui lòng kiểm tra lại id",
      });
    }
  };
  useEffect(() => {
    if (params.id === "10") {
      setState({
        loading: false,
        error: "Lỗi! Tài khoản admin không thể cập nhập. Vui lòng thử lại",
      });
    } else {
      fetchData();
    }
  }, [params.id]);
  const router = useRouter();
  const isValidate = (value, n) => {
    if (n === 1) {
      let reg = /^[\S]+(?: [\S]+)*$/;
      let name = value.replace(/\s/g, "");
      if (reg.test(value) && name.length > 2) {
        setData({ ...data, name: value });
        setErrors({ ...errors, name: null });
      } else {
        setErrors({
          ...errors,
          name: "Họ tên ít nhất 3 kí tự không chứa khoảng trắng đầu và cuối",
        });
        setData({ ...data, name: null });
      }
    }
    if (n === 2) {
      let reg = /^0\d{9}$/;
      if (reg.test(value)) {
        setData({ ...data, phone: value });
        setErrors({ ...errors, phone: null });
      } else {
        setErrors({ ...errors, phone: "Nhập số điện thoại 10 chữ số" });
        setData({ ...data, phone: null });
      }
    }
    if (n === 3) {
      let reg = /^[a-zA-Z0-9]{3,}@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$/;
      if (reg.test(value)) {
        setData({ ...data, email: value });
        setErrors({ ...errors, email: null });
      } else {
        setErrors({ ...errors, email: "Vui lòng nhập email đúng định dạng" });
        setData({ ...data, email: null });
      }
    }
    if (n === 4) {
      if (value === "") {
        setPassword(null);
        setErrors({ ...errors, password: null });
        return;
      }
      let reg = /^[\s\S]*$/;
      let pass = value.replace(/\s/g, "");
      if (reg.test(value) && pass.length > 5) {
        setPassword(value);
        setErrors({ ...errors, password: null });
      } else {
        setPassword(null);
        setErrors({
          ...errors,
          password: "Vui lòng nhập mật khẩu ít nhất 6 kí tự",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !role ||
      (!password && errors.password)
    ) {
      toast.error("Lỗi! Hãy nhập dữ liệu đúng cú pháp");
      return;
    }
    var pass = password ? crypto.MD5(password).toString() : data.password;
    var nameUpperCase = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const { error } = await updateAccount(
      params.id,
      nameUpperCase,
      data.role,
      data.address,
      data.email,
      data.phone,
      pass,
      data.active
    );
    if (!error) {
      toast.success("Cập nhập thành công");
      router.back();
    } else {
      if (error?.message.includes("duplicate")) {
        toast.error("Lỗi! Tài khoản đã bị trùng email");
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
        <div className="alert alert-danger">{state.error}</div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cập nhập tài khoản
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Họ và tên
                  </label>

                  <input
                    type="text"
                    value={data.name}
                    title="Họ tên ít nhất 3 kí tự không chứa số và kí tự đặt biệt"
                    onChange={(e) => isValidate(e.target.value, 1)}
                    placeholder="Họ tên"
                    style={errors.name && { borderColor: "red" }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Số điện thoại
                  </label>
                  <input
                    value={data.phone}
                    onChange={(e) => isValidate(e.target.value, 2)}
                    type="text"
                    placeholder="Số điện thoại"
                    style={errors.phone && { borderColor: "red" }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.phone && (
                    <span className="text-danger">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    placeholder="Email"
                    style={errors.email && { borderColor: "red" }}
                    onChange={(e) => isValidate(e.target.value, 3)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email}</span>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                    placeholder="Địa chỉ"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="*******"
                    style={errors.password && { borderColor: "red" }}
                    onChange={(e) => isValidate(e.target.value, 4)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  {errors.password && (
                    <span className="text-danger">{errors.password}</span>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phân quyền
                  </label>
                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      onChange={(e) =>
                        setData({ ...data, role: e.target.value })
                      }
                      value={data.role}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                      {role.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          style={{ zIndex: 999, padding: "5px" }}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className="mb-4.5 flex flex-row gap-6 xl:flex-row"
                style={{ alignItems: "center" }}
              >
                <label className=" text-black dark:text-white">Hoạt động</label>
                <Switcher
                  enabled={data.active}
                  onChange={() => setData({ ...data, active: !data.active })}
                />
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

export default EditAccount;
