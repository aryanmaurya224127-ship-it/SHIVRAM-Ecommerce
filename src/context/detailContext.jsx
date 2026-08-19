import { createContext, useContext, useState } from "react";

const DetailContext = createContext();

export function DetailProvider({ children }) {

  const [detail, setDetail] = useState([]);

  const productDetail = (product) => {
    setDetail([product]);
  };

  return (
    <DetailContext.Provider
      value={{
        detail,
        productDetail,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
}

export function useDetail() {
  return useContext(DetailContext);
}