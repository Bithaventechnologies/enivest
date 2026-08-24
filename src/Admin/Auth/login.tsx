/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
// import Button from "../../components/Button";
import InputField from "../../components/Inputfield";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { ImSpinner9 } from "react-icons/im"; // Import the spinner icon

const Adminlogin = () => {
  const nav = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  // API Call function (Mutation)
  const loginUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEVE_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success(data.message);
      Cookies.set("authToken", data?.data?.token);
      Cookies.set("userId", data?.data?.admin._id);
      Cookies.set("userEmail", email);
      nav("/admin/all-users");

      return data;
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  // UseMutation Hook
  const { isPending, mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful!");
      // If you have a modal that needs to close, pass a prop and call it here
    },
  });

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="w-[40%] h-[26rem] max-md:w-[90%] max-lg:w-[80%] max-md:h-[29rem] flex justify-around items-center flex-col">
      <div className="w-full h-[15%] flex justify-center items-center">
        <p className="text-2xl font-semibold text-white">Admin Login</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full h-[80%] flex flex-col justify-start gap-5 items-center max-md:h-[90%]"
      >
        <div className="w-full h-[22%] flex flex-col justify-center items-start px-2">
          <label className="text-white font-semibold">Email</label>
          <InputField
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={setemail} // ✅ Fixed onChange
          />
        </div>
        <div className="w-full h-[22%] flex flex-col justify-center items-start px-2">
          <label className="text-white font-semibold">Password</label>
          <InputField
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setpassword} // ✅ Fixed onChange
          />
        </div>

        <div className="w-full h-[25%] flex justify-around items-center flex-col">
          <button
            className="w-full bg-orange-500 text-white disabled:bg-orange-500/50 p-2 rounded flex justify-center items-center"
            disabled={isPending} // ✅ Disables button when request is pending
          >
            {isPending ? <ImSpinner9 className="animate-spin" /> : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Adminlogin;
