import classNames from "classnames";
import React from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "16px",
  className = "",
}) => {
  return (
    <div
      className={classNames("skeleton", className)}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
