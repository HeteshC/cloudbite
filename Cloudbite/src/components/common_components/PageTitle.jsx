import { useEffect } from "react";

const PageTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title ? `${title} | CLOUDBITE` : "CLOUDBITE";
  }, [title]);

  return children;
};

export default PageTitle;
