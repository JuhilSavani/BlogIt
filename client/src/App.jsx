import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  useLocation,
  matchPath,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProtectedLoader from "./utils/ProtectedLoader";
import Blog from "./components/Blog";
import EditBlog from "./components/EditBlog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "./components/Slider";
import EmailVerify from "./pages/EmailVerify";

// Define a layout component
const Layout = () => {
  const location = useLocation();
  
  const navbarRoutes = ["/", "/about", "/sign-in", "/sign-up", "/create"];
  const isDashboardRoute = matchPath("/dashboard/:username", location.pathname);
  const isVerifyRoute = matchPath("/verify/:email", location.pathname);

  const showNavbar = navbarRoutes.includes(location.pathname) || isDashboardRoute || isVerifyRoute;
  
  return (
    <>
      {showNavbar && <Navbar />}
      <div id="outlet">
        <Outlet />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Slider/>
      </div>
    </>
  );
};

// Define the routes
const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route element={<ProtectedLoader />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />

      <Route path="sign-in" element={<Login />} />
      <Route path="sign-up" element={<Register />} />
      <Route path="verify/:email" element={<EmailVerify />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="create" element={<Create />} />
        <Route path="edit/:id" element={<EditBlog />} />
      </Route>

      <Route path="dashboard/:username" element={<Dashboard />} />
      <Route path="blog/:id" element={<Blog />} />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
);

const App = () => {
  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default App;
