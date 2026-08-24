import React, { useState } from "react";
import { Textbox } from "react-inputs-validation";
import PhoneInput from "react-phone-number-input";
import { FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import "react-phone-number-input/style.css";
import "./style.css";

interface InputFieldProps {
  placeholder?: string;
  type?: "text" | "password" | "email" | "phone";
  required?: boolean;
  check?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder = "Enter text.",
  type = "text",
  required = false,
  check = true,
  onChange,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (type === "phone") {
    // Handle Phone Input
    return (
      <PhoneInput
        value={value}
        onChange={(value) => onChange(value || "")}
        placeholder={placeholder}
        className="phone-input-custom"
      />
    );
  }

  return (
    <div className="relative w-full">
      {/* Icons for Name and Email */}
      {(type === "text" || type === "email") && (
        <div className="absolute top-1/2 right-7 transform -translate-y-1/2 text-gray-200">
          {type === "text" && <FiUser size={20} />}
          {type === "email" && <MdOutlineMailOutline size={20} />}
        </div>
      )}

      <Textbox
        value={value}
        classNameInput="w-full h-[47px] px-[12px] bg-transparent text-gray-100 rounded border border-solid border-gray-500 placeholder:text-gray-200 text-[14px] outline-none"
        attributesInput={{
          type: type === "password" && showPassword ? "text" : type,
          placeholder,
        }}
        onChange={(value: string) => {
          onChange(value);
        }}
        onBlur={() => {}}
        validationOption={{
          required: required, // Boolean indicating if field is required
          check,
          customFunc: (value: string) => {
            if (required && !value) {
              return "This field is required."; // Custom error message
            }
            return true; // Validation passed
          },
          ...(type === "email" && {
            reg: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.toString().slice(1, -1),
            regMsg: "Please enter a valid email address.",
          }),
        }}
      />

      {/* Password Toggle Icon */}
      {type === "password" && (
        <div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 px-5 cursor-pointer text-gray-200"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </div>
      )}
    </div>
  );
};

export default InputField;
