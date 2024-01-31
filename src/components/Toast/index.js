import "./style.scss";

import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";

if (typeof window !== "undefined") {
  injectStyle();
}

export default function Toast(props) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </>
  );
}
