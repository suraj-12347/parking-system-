import Header from "./Header";

const FullScreenLayout = ({ children }) => {
  return (
    <main className="min-h-full w-full">
      <div className="mx-auto w-full max-w-7xl p-6">
        {children}
      </div>
    </main>
  );
};

export default FullScreenLayout;