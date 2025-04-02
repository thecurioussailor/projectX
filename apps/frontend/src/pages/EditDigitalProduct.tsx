import DigitalProductEditFrom from "../components/digitalProducts/DigitalProductEditFrom";
import { CgArrowTopRightR } from "react-icons/cg";
import { useParams, useNavigate } from "react-router-dom";
import { useDigitalProduct } from "../hooks/useDigitalProduct";
const EditDigitalProduct = () => {
  const navigate = useNavigate();
  const { currentProduct, publishProduct, unpublishProduct } = useDigitalProduct();
  const { id } = useParams();
  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">Digital Product</h1>
        <div className="flex bg-[#7F37D8] rounded-3xl overflow-clip">
          {currentProduct?.status === "ACTIVE" ? (
            <button 
              onClick={() => unpublishProduct(id as string)}
              className=" font-semibold text-white border-r border-white py-2 px-4 hover:bg-[#6C2EB9] transition-colors"
          >
            Unpublish
          </button>
          ) : (
            <button 
              className="font-semibold flex items-center gap-2 text-white py-2 pl-2 pr-4 hover:bg-[#6C2EB9] transition-colors"
              onClick={() => publishProduct(id as string)}
            >
              Publish
            </button>
          )}
           <button 
              className="font-semibold flex items-center gap-2 text-white py-2 pl-2 pr-4 hover:bg-[#6C2EB9] transition-colors"
              onClick={() => {
                navigate(`/d/${currentProduct?.id}`);
              }}
            >
              <CgArrowTopRightR size={20} />
            </button>
        </div>
      </div>
      <DigitalProductEditFrom productId={id as string}/>
    </section>
  );
};

export default EditDigitalProduct; 