const colors = {
  success: "bg-green-100 text-green-700 border-green-300",
  danger: "bg-red-100 text-red-700 border-red-300",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  info: "bg-blue-100 text-blue-700 border-blue-300",
  gray: "bg-slate-100 text-slate-700 border-slate-300",
};

const Badge = ({ children, variant = "gray" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${colors[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;