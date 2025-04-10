import { useParams, useNavigate } from "react-router-dom";
import Bali from "../assets/images/bali.jpg";
import { useDigitalProduct } from "../hooks/useDigitalProduct";
import { useEffect, useState } from "react";
import { PublicDigitalProduct, Testimonial } from "../store/useDigitalProductStore";
import { useAuth } from "../hooks/useAuth";
import FaqCard from "../components/ui/FaqCard";
import { FaStar } from "react-icons/fa";

const PublicDigitalProductPage = () => {
  const { isAuthenticated } = useAuth();
  const { fetchPublicProductBySlug, getCoverImage } = useDigitalProduct();
  const { slug } = useParams();
  const [product, setProduct] = useState<PublicDigitalProduct | null>(null);
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await fetchPublicProductBySlug(slug as string);
      setProduct(product);
      setAmount(product?.price || 0);
      const coverImage = await getCoverImage(product?.id);
      setCoverImage(coverImage);
    };
    fetchProduct();
  }, [slug, fetchPublicProductBySlug, getCoverImage]);

  return (
    <div className="relative w-full h-[calc(100vh-100px)]">
      <div className="p-16 px-32 w-3/5">
          <div className="flex items-center gap-4">
            <img src={Bali} alt="Digital Product" className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-1">
              <p className="text-gray-500">Created by</p>
              <p className="font-semibold text-zinc-900 uppercase">{product?.creator?.name}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-10 gap-y-6">
            <h1 className="text-4xl font-semibold">{product?.title}</h1>
            {coverImage && <img src={coverImage} alt="Digital Product" className="w-full rounded-3xl" />}
            <div className="flex flex-col gap-2">
              <p className="text-zinc-900 font-semibold text-2xl mb-4">Description</p>
              <p className="text-gray-500">{product?.description}</p>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-zinc-900 text-2xl font-semibold">Testimonials</h1>
              <div className="flex flex-col gap-4">
                {product?.testimonials.map((testimonial) => (
                  <TesminonialCard 
                    key={testimonial.id} 
                    testimonial={testimonial} 
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-900 font-semibold text-2xl mb-4">Frequently Asked Questions</p>
              <div className="flex flex-col">
                {product?.faqs.map((faq) => (
                  <FaqCard 
                    key={faq.id} 
                    title={faq.question} 
                    content={faq.answer} 
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-zinc-900 font-semibold text-2xl">Gallery</p>
              <div className="grid grid-cols-2 gap-4">
                <img src={Bali} alt="Digital Product" className="w-full h-full rounded-md" />
                <img src={Bali} alt="Digital Product" className="w-full h-full rounded-md" />
                <img src={Bali} alt="Digital Product" className="w-full h-full rounded-md" />
                <img src={Bali} alt="Digital Product" className="w-full h-full rounded-md" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-900 font-semibold text-2xl mb-4">Contact</p>
              <div className="flex flex-col gap-2">
                <p className="text-gray-500">Email</p>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-500">Address</p>
              </div>
            </div>
            <div className="text-gray-500 rounded-3xl p-4 bg-[#7F37D8] flex flex-col gap-2">
              <p className="font-bold text-white text-xl">Terms and Conditions</p>
              <p className="text-white">You agree to share information entered on this page with Ashutosh Sagar (owner of this page) and Cosmofeed, adhering to applicable laws.</p>
            </div>
            <div className="text-gray-500 rounded-3xl p-4 bg-[#7F37D8] mb-6 flex flex-col gap-2">
              <p className="font-bold text-white text-xl">Disclaimer</p>
              <p className="text-white">Polmi Software Services Technologies Pvt. Ltd. shall not be held liable for any content or materials published, sold, or distributed by content creators on our associated apps or websites.Learn more</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <h1 className="text-2xl font-semibold">projectX</h1>
              <p className="text-gray-500">Want to create your own payment page? Experience hassle-free payouts and premium support.Get started now!</p>
            </div>
          </div>
      </div>
      <div className="fixed top-24 right-32 shadow-lg rounded-3xl w-1/3">
          <div className="flex justify-between items-center px-4 py-8 border-b border-gray-200">
            <h1 className="text-2xl font-semibold">Payment Details</h1>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="text" id="name" required/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="email" id="email" required/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Phone</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="text" id="phone" required/>
            </div>
            {product?.priceType === "FIXED" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Original Amount</label>
                  <p className="text-2xl font-semibold">₹ {product?.price}</p>
                </div>
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Discount</label>
                  <p className="text-2xl font-semibold">₹ {product?.price - product?.discountedPrice}</p>
                </div>
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Total Amount</label>
                  <p className="text-2xl font-semibold">₹ {product?.discountedPrice}</p>
                </div>
              </div>
            )}
            {product?.priceType === "FLEXIBLE" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Minimum Amount</label>
                  <p className="text-2xl font-semibold">₹ {product?.price}</p>
                </div>
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Enter Amount</label>
                  <input 
                    className="border border-gray-300 rounded-md p-2"
                    type="number"
                    id="amount" 
                    min={product?.price} 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Total Amount</label>
                  <p className="text-2xl font-semibold">₹ {amount}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(`/checkout/${product?.id}`);
                  } else {
                    navigate('/signup');
                  }
                }}  
                className="bg-[#7F37D8] text-white rounded-3xl p-2">
                  { product?.ctaButtonText || "Pay Now"}
                </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default PublicDigitalProductPage

const TesminonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div key={testimonial.id} className="bg-white py-6 rounded-3xl shadow-sm border">
        <div className="flex items-center gap-4 mb-4 justify-between border-b pb-4 px-6">
            <div className="flex items-center justify-between gap-4">
                {/* {testimonial.image && (
                    <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )} */}
                <div>
                    <h2 className="font-semibold text-2xl">{testimonial.name}</h2>
                </div>
            </div>

        </div>
        <div className="px-6">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-purple-600`}>
                        <FaStar size={30}/>
                    </span>
                ))}
            </div>
            <p className="text-gray-600 py-4">{testimonial.description}</p>
        </div>
    </div>
  )
}