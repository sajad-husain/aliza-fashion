import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import CollectionSpotlight from "../components/CollectionSpotlight";
import LookbookSection from "../components/LookbookSection";
import TrustStrip from "../components/TrustStrip";
import WhyChooseUs from "../components/WhyChooseUs";
import AboutBrand from "../components/AboutBrand";
import Newsletter from "../components/Newsletter";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <CollectionSpotlight />
      <FeaturedProducts />
      <LookbookSection />
      <TrustStrip />
      <WhyChooseUs />
      <AboutBrand />
      <Newsletter />
    </main>
  );
};

export default HomePage;
