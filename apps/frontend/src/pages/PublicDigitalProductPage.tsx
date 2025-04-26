import { useParams, useNavigate } from "react-router-dom";
import Bali from "../assets/images/bali.jpg";
import { useDigitalProduct } from "../hooks/useDigitalProduct";
import { useEffect, useState } from "react";
import { GalleryImage, PublicDigitalProduct, Testimonial } from "../store/useDigitalProductStore";
import { useAuth } from "../hooks/useAuth";
import FaqCard from "../components/ui/FaqCard";
import { FaStar } from "react-icons/fa";
import { load } from '@cashfreepayments/cashfree-js';
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Error404 from "../components/ui/Error404";

const PublicDigitalProductPage = () => {
  const { isAuthenticated } = useAuth();
  const { 
    fetchPublicProductBySlug, 
    getCoverImage, 
    initiatePurchase, 
    handlePaymentCallback,
    getGalleryImage,
    isLoading,
    error 
  } = useDigitalProduct();
  const { slug } = useParams();
  const [product, setProduct] = useState<PublicDigitalProduct | null>(null);
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (slug) {
          const product = await fetchPublicProductBySlug(slug);
          setProduct(product);
          // Set default amount based on pricing
          const defaultAmount = product?.hasDiscount && product?.discountedPrice
            ? product.discountedPrice
            : product?.price || 0;
          setAmount(defaultAmount);
          
          // Get cover image
          if (product?.id) {
            const coverImage = await getCoverImage(product.id);
            setCoverImage(coverImage);
            }

          // Get gallery images
          if (product?.id) {
            const galleryImagesArray = await getGalleryImage(product.id);
            console.log(galleryImagesArray);
            setGalleryImages(galleryImagesArray || []);
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    fetchProduct();
  }, [slug, fetchPublicProductBySlug, getCoverImage]);

  const handlePurchase = async () => {
    if (!product || !amount) return;
    
    try {
      // For flexible pricing, pass the custom amount
      const customAmount = product.priceType === "FLEXIBLE" ? amount : undefined;
      const paymentSession = await initiatePurchase(product.id, customAmount);

      // Store pending payment info in localStorage
      localStorage.setItem('pendingPayment', JSON.stringify({
        productId: product.id,
        orderId: paymentSession.orderId,
        productType: 'DIGITAL_PRODUCT'
      }));

      // Load Cashfree SDK
      const cashfree = await load({
        mode: process.env.NODE_ENV === "production" ? "production" : "sandbox"
      });

      if (!cashfree) {
        throw new Error("Failed to load Cashfree SDK");
      }

      try {
        // Initiate checkout
        const result = await cashfree.checkout({
          paymentSessionId: paymentSession.paymentSessionId,
          redirectTarget: "_modal"
        });

        // Handle manual redirect if needed
        console.log('Payment result:', result);
        
        // Call payment callback and redirect
        const status = await handlePaymentCallback(paymentSession.orderId, "DIGITAL_PRODUCT");
        if (status === "success") {
          window.location.href = `${window.location.origin}/payment-success?orderId=${paymentSession.orderId}`;
        } else {
          window.location.href = `${window.location.origin}/payment-failed?orderId=${paymentSession.orderId}`;
        }
      } catch (error) {
        console.error("Payment failed:", error);
        window.location.href = `${window.location.origin}/payment-failed?orderId=${paymentSession.orderId}`;
      }
    } catch (err) {
      console.error("Failed to initiate purchase:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Error404 error={error} />
    );
  }

  if (!product) {
    return (
      <Error404 error="Product Not Found" />
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-100px)]">
      <div className="p-8 md:p-16 lg:px-32 w-full lg:w-3/5">
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
                {galleryImages.map((image) => (
                  <img key={image.id} src={image.imageUrl} alt="Digital Product" className="w-full h-full rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-zinc-900 font-semibold text-2xl mb-4">Contact</p>
              <div className="flex flex-col gap-2">
                <p className="text-gray-500">Email: {product?.creator?.email || 'Not provided'}</p>
                <p className="text-gray-500">Phone: {product?.creator?.phone || 'Not provided'}</p>
                <p className="text-gray-500">Address: {product?.creator?.address || 'Not provided'}</p>
              </div>
            </div>
            <div className="text-gray-500 rounded-3xl p-4 bg-[#7F37D8] flex flex-col gap-2">
              <p className="font-bold text-white text-xl">Terms and Conditions</p>
              <p className="text-white">You agree to share information entered on this page with {product?.creator?.name} (owner of this page) and Cosmofeed, adhering to applicable laws.</p>
            </div>
            <div className="text-gray-500 rounded-3xl p-4 bg-[#7F37D8] mb-6 flex flex-col gap-2">
              <p className="font-bold text-white text-xl">Disclaimer</p>
              <p className="text-white">Polmi Software Services Technologies Pvt. Ltd. shall not be held liable for any content or materials published, sold, or distributed by content creators on our associated apps or websites. <a href="#" className="underline">Learn more</a></p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <h1 className="text-2xl font-semibold">projectX</h1>
              <p className="text-gray-500">Want to create your own payment page? Experience hassle-free payouts and premium support. <a href="#" className="text-[#7F37D8]">Get started now!</a></p>
            </div>
          </div>
      </div>
      
      {/* Payment sidebar for desktop */}
      <div className="hidden lg:block fixed top-24 right-32 shadow-lg rounded-3xl w-1/3 bg-white">
          <div className="flex justify-between items-center px-4 py-8 border-b border-gray-200">
            <h1 className="text-2xl font-semibold">Payment Details</h1>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Phone</label>
              <input 
                className="border border-gray-300 rounded-md p-2"
                type="text" 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {product?.priceType === "FIXED" && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Original Amount</label>
                  <p className="text-2xl font-semibold">₹ {product?.price}</p>
                </div>
                {product?.hasDiscount && (
                  <div className="flex justify-between items-center gap-2 px-4">
                    <label htmlFor="amount">Discount</label>
                    <p className="text-2xl font-semibold">₹ {product?.price - product?.discountedPrice}</p>
                  </div>
                )}
                <div className="flex justify-between items-center gap-2 px-4">
                  <label htmlFor="amount">Total Amount</label>
                  <p className="text-2xl font-semibold">₹ {product?.hasDiscount ? product?.discountedPrice : product?.price}</p>
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
            <div className="flex flex-col gap-2 mt-4">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    handlePurchase();
                  } else {
                    navigate('/signup');
                  }
                }}  
                className="bg-[#7F37D8] text-white rounded-3xl p-2 hover:bg-[#6C2EB9] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!name || !email || !phone || amount < (product?.price || 0)}
              >
                {product?.ctaButtonText || "Pay Now"}
              </button>
            </div>
          </div>
      </div>
      
      {/* Mobile payment form */}
      <div className="lg:hidden w-full p-4 my-8 shadow-lg rounded-3xl bg-white">
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Payment Details</h1>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name-mobile">Name</label>
            <input 
              className="border border-gray-300 rounded-md p-2"
              type="text" 
              id="name-mobile" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email-mobile">Email</label>
            <input 
              className="border border-gray-300 rounded-md p-2"
              type="email" 
              id="email-mobile" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone-mobile">Phone</label>
            <input 
              className="border border-gray-300 rounded-md p-2"
              type="text" 
              id="phone-mobile" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          {/* Price details - same as desktop but mobile friendly */}
          {product?.priceType === "FIXED" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2 px-4">
                <label>Original Amount</label>
                <p className="text-xl font-semibold">₹ {product?.price}</p>
              </div>
              {product?.hasDiscount && (
                <div className="flex justify-between items-center gap-2 px-4">
                  <label>Discount</label>
                  <p className="text-xl font-semibold">₹ {product?.price - product?.discountedPrice}</p>
                </div>
              )}
              <div className="flex justify-between items-center gap-2 px-4">
                <label>Total Amount</label>
                <p className="text-xl font-semibold">₹ {product?.hasDiscount ? product?.discountedPrice : product?.price}</p>
              </div>
            </div>
          )}
          {product?.priceType === "FLEXIBLE" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2 px-4">
                <label>Minimum Amount</label>
                <p className="text-xl font-semibold">₹ {product?.price}</p>
              </div>
              <div className="flex justify-between items-center gap-2 px-4">
                <label>Enter Amount</label>
                <input 
                  className="border border-gray-300 rounded-md p-2"
                  type="number"
                  min={product?.price} 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex justify-between items-center gap-2 px-4">
                <label>Total Amount</label>
                <p className="text-xl font-semibold">₹ {amount}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-2 mt-4">
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  handlePurchase();
                } else {
                  navigate('/signup');
                }
              }}  
              className="bg-[#7F37D8] text-white rounded-3xl p-2 hover:bg-[#6C2EB9] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!name || !email || !phone || amount < (product?.price || 0)}
            >
              {product?.ctaButtonText || "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDigitalProductPage;

const TesminonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div key={testimonial.id} className="bg-white py-6 rounded-3xl shadow-sm border">
        <div className="flex items-center gap-4 mb-4 justify-between border-b pb-4 px-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-semibold text-2xl">{testimonial.name}</h2>
                </div>
            </div>
        </div>
        <div className="px-6">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-purple-600">
                        <FaStar size={30}/>
                    </span>
                ))}
            </div>
            <p className="text-gray-600 py-4">{testimonial.description}</p>
        </div>
    </div>
  );
};