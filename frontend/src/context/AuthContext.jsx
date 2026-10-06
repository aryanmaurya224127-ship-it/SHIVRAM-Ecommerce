import {
  createContext,
  useContext,
  useState,
} from "react";


// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext = createContext(null);


// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {

  // ===================================================
  // INITIAL USER
  // ===================================================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("shivram_user");

    const token =
      localStorage.getItem("shivram_token");


    // -----------------------------------------------
    // USER + TOKEN BOTH EXIST
    // -----------------------------------------------

    if (savedUser && token) {

      try {

        return JSON.parse(savedUser);

      } catch (error) {

        console.error(
          "Saved user parse error:",
          error
        );

        localStorage.removeItem(
          "shivram_user"
        );

        localStorage.removeItem(
          "shivram_token"
        );

        return null;
      }
    }


    // -----------------------------------------------
    // NOT LOGGED IN
    // -----------------------------------------------

    return null;

  });


  // ===================================================
  // LOGIN
  // ===================================================

  const login = (userData, token) => {

    // -----------------------------------------------
    // SAVE USER
    // -----------------------------------------------

    localStorage.setItem(
      "shivram_user",
      JSON.stringify(userData)
    );


    // -----------------------------------------------
    // SAVE JWT TOKEN
    // -----------------------------------------------

    localStorage.setItem(
      "shivram_token",
      token
    );


    // -----------------------------------------------
    // UPDATE REACT STATE
    // -----------------------------------------------

    setUser(userData);


    // -----------------------------------------------
    // NOTIFY CART CONTEXT
    // -----------------------------------------------

    window.dispatchEvent(
      new Event("auth-change")
    );

  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {

    // -----------------------------------------------
    // REMOVE USER
    // -----------------------------------------------

    localStorage.removeItem(
      "shivram_user"
    );


    // -----------------------------------------------
    // REMOVE TOKEN
    // -----------------------------------------------

    localStorage.removeItem(
      "shivram_token"
    );


    // -----------------------------------------------
    // UPDATE REACT STATE
    // -----------------------------------------------

    setUser(null);


    // -----------------------------------------------
    // NOTIFY CART CONTEXT
    // -----------------------------------------------

    window.dispatchEvent(
      new Event("auth-change")
    );

  };


  // ===================================================
  // IS LOGGED IN
  // ===================================================

  const isLoggedIn = !!user;


  // ===================================================
  // CURRENT TOKEN
  // ===================================================

  const token =
    localStorage.getItem("shivram_token");


  // ===================================================
  // PROVIDER
  // ===================================================

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        token,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


// =====================================================
// useAuth HOOK
// =====================================================

export const useAuth = () => {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

};