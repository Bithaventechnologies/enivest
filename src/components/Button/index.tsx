import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  text?: string;
  sm?: boolean;
  type?: "primary" | "secondary" | "submit";
  full?: boolean;
  border?: boolean;
  icon?: {
    position?: "left" | "right";
    element?: ReactNode;
  };
  link?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  sm,
  type = "primary",
  full,
  border,
  icon,
  link,
  ...restProps
}) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (link) {
      e.preventDefault(); // Prevents the default behavior if `link` is provided
      navigate(link); // Navigate to the specified route
    }
    // Add additional click handling logic here if needed
  };

  const cn = classNames(
    "cursor-pointer text-[14px] flex items-center justify-center gap-[6px] px-[16px] w-full whitespace-nowrap rounded-[8px] font-bold",
    { "flex-row": icon?.position !== "right" },
    { "flex-row-reverse": icon?.position === "right" },
    { "w-full": full },
    { "h-[40px] leading-[40px]": sm },
    { "h-[45px] leading-[48px]": !sm },
    { "border border-[#2C2E33] border-solid": border },
    {
      "bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-gray-900 shadow-lg hover:shadow-teal-500/20":
        type !== "secondary",
    },
    { "bg-orange-800 text-[#08090A]": type === "secondary" }
  );

  return (
    <button {...restProps} className={cn} onClick={handleClick}>
      {icon?.element && icon?.element}
      {text ?? "text"}
    </button>
  );
};

export default Button;
