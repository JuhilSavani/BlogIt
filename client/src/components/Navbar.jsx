import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../utils/hooks/useAuth";

const Navbar = () => {
  const { auth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("color-scheme", theme);
  }, [theme]);

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <nav>
        <span className="logo">
          <Link to="/">BlogIt</Link>
        </span>
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/create">Create</NavLink>
          </li>
          {auth?.accessToken && (
            <li>
              <NavLink to={`/dashboard/${auth?.username}`}>Dashboard</NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div>
        {theme === "dark" ? (
          <button onClick={() => setTheme("light")}>
            <i className='bx bxs-sun' style={{fontSize: "1.75rem"}}></i>
          </button>
        ) : (
          <button onClick={() => setTheme("dark")}>
            <i className='bx bxs-moon'></i>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
