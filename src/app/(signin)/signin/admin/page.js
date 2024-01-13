"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase-config";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import * as crypto from "crypto-js";
const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifiedMSG, setVerifiedMSG] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [message1, setMessage1] = useState(null);
  const [message2, setMessage2] = useState(null);
  const [errors, setErrors] = useState(null);

  const isValidEmail = (value) => {
    setVerifiedMSG(null);
    const regexEmail = /^[a-zA-Z0-9]{3,}@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$/;
    const res = regexEmail.test(value);
    if (!res) {
      setMessage1("Email phải đúng định dạng");
      setEmail(null);
    } else {
      setMessage1(null);
      setEmail(value);
    }
  };

  const isValidPassword = (value) => {
    setVerifiedMSG(null);
    if (value === null || value.length < 6) {
      setMessage2("Mật khẩu phải ít nhất 6 kí tự");
      setPassword(null);
    } else {
      setMessage2(null);
      setPassword(value);
    }
  };

  const signIn = async () => {
    setLoading(true);
    if (email && password) {
      const { data, error } = await supabase
        .from("account_admin")
        .select(`*,role(name,permission)`)
        .match({ email: email, password: crypto.MD5(password) });
      if (data.length > 0) {
        if (data[0].active) {
          setCookie("admin", data[0]);
          router.push("/admin/interface/slide");
        } else {
          setLoading(false);
          setErrors("Tài khoản của bạn đã bị quản trị viên đình chỉ hoạt động");
        }
      } else {
        setLoading(false);
        setErrors("Tài khoản hoặc mật khẩu không chính xác");
      }
    } else {
      setLoading(false);
      setErrors(null);
      isValidEmail(email);
      isValidPassword(password);
    }
  };

  useEffect(() => {
    const hash = window?.location?.hash?.split("#")[1];
    const parsedHash = new URLSearchParams(hash);
    if (parsedHash.get("error")) {
      setVerifiedMSG("Liên kết không tồn tại hoặc đã hết hạn!");
    } else if (parsedHash.get("access_token")) {
      setVerifiedMSG("Xác nhận email thành công! Vui lòng đăng nhập");
    }
  }, []);

  // const signUp = async () => {
  //   const { data, error } = await supabase.auth.signUp({
  //     email: email,
  //     password: password,
  //     options: {
  //       data: {
  //         first_name: "John",
  //         age: 27,
  //       },
  //       emailRedirectTo: "http://localhost:3000/signin/admin",
  //     },
  //   });
  // };
  return (
    <>
      <div
        className="bg-white"
        style={{
          backgroundImage: `url(
            "https://t4.ftcdn.net/jpg/02/55/77/03/360_F_255770374_rbmJO9gkkIhMBcyVPc3iW016BCLDvcWc.jpg"
          )`,
          backgroundSize: "cover",
          opacity: 0.8,
        }}
      >
        <div className="justify-center">
          <div
            className="xl:w-1/2 rounded bg-white"
            style={{
              border: "0.5px solid gray ",
              height: "100vh",
            }}
          >
            <div className="w-full sm:p-12.5" style={{ paddingTop: "120px" }}>
              <h2 className="mb-9 font-bold text-black dark:text-white sm:text-title-xl2">
                Đăng nhập hệ thống
              </h2>
              {verifiedMSG ? (
                <div className="mb-5">
                  <span
                    className={
                      verifiedMSG.includes("hết hạn")
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {verifiedMSG}
                  </span>
                </div>
              ) : (
                ""
              )}
              {errors ? (
                <div className="mb-5">
                  <span className="text-danger">{errors}</span>
                </div>
              ) : (
                ""
              )}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    style={
                      message1
                        ? { borderColor: "red" }
                        : { borderColor: "rgb(226 232 240)" }
                    }
                    onChange={(event) => isValidEmail(event.target.value)}
                    type="email"
                    placeholder="Nhập email.."
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                  {message1 ? (
                    <div>
                      <span className="text-danger">{message1}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    style={
                      message2
                        ? { borderColor: "red" }
                        : { borderColor: "rgb(226 232 240)" }
                    }
                    onChange={(event) => isValidPassword(event.target.value)}
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                  {message2 ? (
                    <div>
                      <span className="text-danger">{message2}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="mb-5">
                <button
                  onClick={() => signIn()}
                  disabled={loading ? true : false}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                >
                  {loading ? (
                    <div
                      className="flex justify-center"
                      style={{ alignItems: "center" }}
                    >
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-t-transparent mr-3"></div>
                      Đăng nhập
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
