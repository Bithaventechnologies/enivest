/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState } from "react";
// import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
// import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner9 } from "react-icons/im";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignup, setIsSignup] = useState(false);

  const url = `${import.meta.env.VITE_DEVE_URL}`;

  console.log(url);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-[#1A1A1A] text-white p-6 rounded-lg shadow-lg w-96">
        {/* Toggle Login / Signup */}
        <div className="flex justify-between border-b border-gray-700 pb-2 mb-4">
          <button
            className={`w-1/2 pb-2 text-lg ${
              !isSignup
                ? "text-orange-400 border-b-2 border-orange-400"
                : "text-gray-500"
            }`}
            onClick={() => setIsSignup(false)}
          >
            Log In
          </button>
          <button
            className={`w-1/2 pb-2 text-lg ${
              isSignup
                ? "text-orange-400 border-b-2 border-orange-400"
                : "text-gray-500"
            }`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {isSignup ? (
          <SignupForm setIsSignup={setIsSignup} />
        ) : (
          <LoginForm onClose={onClose} />
        )}

        {/* Social Login */}
        {/* <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">OR</p>
          <div className="flex justify-center space-x-4 mt-2">
            <FaFacebook className="text-blue-500 cursor-pointer" size={24} />
            <FaGoogle className="text-red-500 cursor-pointer" size={24} />
            <FaApple className="text-gray-300 cursor-pointer" size={24} />
          </div>
        </div> */}
      </div>
    </Dialog>
  );
};

type LogProps = {
  onClose: () => void;
};

// Login Form
const LoginForm = ({ onClose }: LogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEVE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        throw new Error(data.message || "Login failed");
      }

      toast.success(data.message);
      Cookies.set("authToken", data?.data?.token);
      Cookies.set("userId", data?.data?.user.id);
      navigate("/user/overview");
      return { success: true, data };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
        />
      </div>
      <button
        className="w-full bg-orange-500 text-white disabled:bg-orange-500/50 p-2 rounded flex justify-center items-center"
        disabled={isPending}
      >
        {isPending ? <ImSpinner9 className="animate-spin" /> : "Continue"}
      </button>
    </form>
  );
};

type Props = {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
};

// Signup Form
const SignupForm = ({ setIsSignup }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && name.trim()) {
      setShowPassword(true);
    }
  };

  const signUpUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DEVE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Network error");
        throw new Error(data.message || "Sign-up failed");
      }

      toast.success(data.message);
      console.log(data);

      return { success: true, data };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      setIsSignup(false);
    },
  });

  return (
    <form onSubmit={handleContinue} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
        />
      </div>
      {!showPassword && (
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          Continue
        </button>
      )}
      {showPassword && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="mb-4">
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
            />
          </div>
          <button
            className="w-full bg-orange-500 disabled:bg-orange-500/50 text-white p-2 rounded flex justify-center items-center"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? <ImSpinner9 className="animate-spin" /> : "Submit"}
          </button>
        </motion.div>
      )}
    </form>
  );
};

export default AuthModal;
