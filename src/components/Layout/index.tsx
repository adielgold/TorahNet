import NavbarWrapper from "../Navbar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return <NavbarWrapper>{children}</NavbarWrapper>;
};

export default LayoutWrapper;
