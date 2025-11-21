import BlogProductSection from "../components/home/BlogProductSection";
import EventCarousel from "../components/home/EventCarousel";
import ProductGridSection from "../components/home/ProductGridSection";
import QuickLinks from "../components/home/QuickLinks";
import Header from "../components/layout/Header";

const Home = () => {
  return (
    <div className="app-container dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="py-8">
        <EventCarousel />
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <QuickLinks />
        <BlogProductSection />
        <ProductGridSection />
        {/* <h2 className="text-(--text-primary) dark:text-gray-100 text-2xl mt-8">
          Main Content Goes Here
        </h2> */}
      </main>

      {/* Footer */}
    </div>
  );
};

export default Home;
