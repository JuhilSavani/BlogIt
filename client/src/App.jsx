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

// Define a layout component
const Layout = () => {
  const location = useLocation();
  const navbarRoutes = ["/", "/about", "/sign-in", "/sign-up", "/create"];
  const isDashboardRoute = matchPath("/dashboard/:username", location.pathname);

  const showNavbar =
    navbarRoutes.includes(location.pathname) || isDashboardRoute;
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
      {/* Public */}
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="sign-in" element={<Login />} />
      <Route path="sign-up" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="create" element={<Create />} />
        <Route path="dashboard/:username" element={<Dashboard />} />
        <Route path="blog/:id" element={<Blog />} />
        <Route path="edit/:id" element={<EditBlog />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
);

const App = () => {
  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default App;
