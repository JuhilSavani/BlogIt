import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
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
    document.documentElement.setAttribute('color-scheme', theme);
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
        </ul>
      </nav>
      <div>
        {theme === "dark" ? (
          <button onClick={() => setTheme("light")}>
            <SunIcon style={{height: "30px"}}/>
          </button>
        ) : (
          <button onClick={() => setTheme("dark")}>
            <MoonIcon style={{height: "24px"}}/>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
