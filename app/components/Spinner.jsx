import Image from "next/image";
import loader from "./spinner.gif";

const Spinner = () => {
  return (
    <div>
      <Image src={loader} alt="loading.." />
    </div>
  );
};

export default Spinner;
