import { Rating } from "@/components";
import withAuth from "@/components/withAuth/withAuth";

const RatingPage = () => {
  return (
    <section className="w-full h-screen flex flex-col">
      <Rating />
    </section>
  );
};

export default withAuth(RatingPage);
