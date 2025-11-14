import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import Gnb from "./Gnb";

const Header = () => {
  return (
    <header className="w-full">
      <TopBar />
      <MainHeader />
      <Gnb />
    </header>
  );
};

export default Header;
