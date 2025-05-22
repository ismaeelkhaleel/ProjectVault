import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const RouteChangeLoader = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeLoader;
