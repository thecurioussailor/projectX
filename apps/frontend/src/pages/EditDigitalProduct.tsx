import DigitalProductEditFrom from "../components/digitalProducts/DigitalProductEditFrom";
import { useParams } from "react-router-dom";
const EditDigitalProduct = () => {
  const { id } = useParams();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">Digital Product</h1>
      </div>
      <DigitalProductEditFrom productId={id as string}/>
    </section>
  );
};

export default EditDigitalProduct; 