import Navbar from "../Layout/Navbar";
import Topsection from "../Layout/Topsection";
import PriceTable from "./PriceTable";
import background from "../../assests/pricing/pricingBackground.jpg";
import { useEffect, useState } from "react";
import Partners from "../Layout/Partners";
import News from "../News";
import Footer from "../Layout/Footer";

const Pricing = () => {
  // const [category, setCategory] = useState({
  //   individual: true,
  //   team: false,
  //   student: false
  // });

  // const setCategoryHandler = (e) => {
  //   const selectedValue = e.target.id;

  //   setCategory({
  //     individual: selectedValue === "individual",
  //     team: selectedValue === "team",
  //     student: selectedValue === "student"
  //   });
  // };

  const [subscription, setSubscription] = useState({
    monthly: true,
    yearly: false
  });

  const subscriptionHandler = (e) => {
    const selectedValue = e.target.id;
    setSubscription({
      monthly: selectedValue === "monthly",
      yearly: selectedValue === "yearly"
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pricing-wrapper w-full h-max">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Get the best"} image={background} />

      {/* comment:title-description */}
      <div className="title-description w-full h-max flex flex-col gap-2 px-[10vh] my-20">
        <h1 className="text-[60px] font-semibold">Plans and Pricing</h1>
        <p className="text-[30px] font-light">
          Flexible plans for everyone—from individual students and researchers,
          to large businesses and universities.
        </p>
      </div>

      {/* comment:individual-team-student */}
      <div className="category-section  w-full h-max px-[10vh] max-[1025px]:px-5 flex flex-col items-center justify-center mb-20">
        {/* comment:monthly-yearly-selection */}
        {/* TODO:add padding p-1 if you needed */}

        <div className="monthly-yearly-selection w-[30%] max-[1025px]:w-[30%] h-max rounded-full border-[1px] border-secondary ">
          <button
            id="monthly"
            className={`w-[50%] h-[50px] rounded-full cursor-pointer ${
              subscription.monthly
                ? "bg-secondary text-white "
                : "bg-white text-secondary"
            }  `}
            onClick={subscriptionHandler}
          >
            Monthly
          </button>
          <button
            id="yearly"
            className={`w-[50%] h-[50px] rounded-full cursor-pointer ${
              subscription.yearly
                ? "bg-secondary text-white"
                : "bg-white text-secondary"
            } `}
            onClick={subscriptionHandler}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* pricing table */}
      <PriceTable subscription={subscription} />

      {/* partners */}
      <Partners />

      {/* news */}
      <News />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Pricing;
