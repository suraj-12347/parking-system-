const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>

      <p className="text-sm font-medium text-slate-600">
        {text}
      </p>
    </div>
  );
};

export default Loader;