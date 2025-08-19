import Header from "./header";
import "../styles/layout.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
