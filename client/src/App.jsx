import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';

// Define a layout component 
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
};


// Define the routes
const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
  </Route>
);


const App = () => {
  return (
    <RouterProvider router={createBrowserRouter(routes)} />
  );
};

export default App;