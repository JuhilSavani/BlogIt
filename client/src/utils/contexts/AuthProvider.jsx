import React, { createContext, useState } from "react";
import PropTypes from "prop-types"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [isDeviceTrusted, setIsDeviceTrusted] = useState(
    JSON.parse(localStorage.getItem("isDeviceTrusted")) || false
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, isDeviceTrusted, setIsDeviceTrusted }}>
      {children}
    </AuthContext.Provider>
  );
}

// Define prop types for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default AuthContext;