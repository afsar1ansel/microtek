"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import style from "./page.module.css";
import Image from "next/image";
import logo from "/public/logo_3.png";
import photo from "/public/Photo.png";
import Link from "next/link";
import { useMyContext } from "../../../context/MyContext";

export default function Login() {
  let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setState } = useMyContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const detail = new FormData();
    detail.append("email", email);
    detail.append("password", password);

    try {
      const response = await fetch(`${baseURL}/app-users/validate-user`, {
        method: "POST",
        body: detail,
        // mode: "no-cors",
      });

      const res: {
        errFlag: number;
        message?: string;
        token?: string;
        modules_permitted?: string;
        username?: string;
      } = await response.json();

      // console.log(res);
      if (res.errFlag === 0 && res.token) {
        setState(res.token);
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.username ?? "Admin");
       if (res.modules_permitted !== undefined) {
         localStorage.setItem("permits", res.modules_permitted);
       }else{
         localStorage.setItem("permits", "Nan");
       }
        // console.log(res);
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.logbody}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={style.logo}>
        <Image src={logo} alt="Logo" width={300} height={100} />
      </div>
      <div className={style.form}>
        <div>
          <Image src={photo} alt="pic" width={500} height={400} />
        </div>
        <div>
          <form className={style.formbox} onSubmit={handleSubmit}>
          <h2>Login to your account</h2>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className={style.password}>
              <label htmlFor="password">Password</label>
              <Link className={style.forgotLink} href="/auth/forgotpassword">
                Forgot Password ?
              </Link>
            </div>

            <div className={style.passwordField}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className={style.forgot}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
