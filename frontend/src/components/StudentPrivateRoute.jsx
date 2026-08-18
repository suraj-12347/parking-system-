import { Navigate, Outlet, useLocation } from "react-router-dom";

const StudentPrivateRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("studentToken");

  if (!token) {
    return (
      <Navigate
        to="/student/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default StudentPrivateRoute;