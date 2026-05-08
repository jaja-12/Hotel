import logo from "../../assets/logo hotel.png";

const sizeClasses = {
  sm: "h-9 w-32",
  md: "h-11 w-40",
  lg: "h-28 w-52",
};

export const BrandLogo = ({ size = "md", className = "" }) => (
  <img
    src={logo}
    alt="AurumStay"
    className={`${sizeClasses[size]} object-contain ${className}`}
  />
);
