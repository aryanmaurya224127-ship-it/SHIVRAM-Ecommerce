import Navbar from "./Navbar";

import Footer from "./Footer.jsx";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        

        <div style={{ flex: 1, padding: "20px" }}>
          {children}
        </div>

      </div>

      <Footer />
    </>
  );
}

export default MainLayout;