const Card = ({ title, children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white shadow-lg border border-slate-200 ${className}`}
    >
      {title && (
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
      )}

      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;