import { FaStar } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"
import { Testimonial } from "../../store/useDigitalProductStore";

interface TesminonialCardProps {
    testimonial: Testimonial;
    handleDeleteTestimonial: (id: string) => void;
    isDeleting: string | null;
}

const TesminonialCard = ({ testimonial, handleDeleteTestimonial, isDeleting }: TesminonialCardProps) => {
  return (
    <div key={testimonial.id} className="bg-white py-6 rounded-3xl shadow-sm border">
        <div className="flex items-center gap-4 mb-4 justify-between border-b pb-4 px-6">
            <div className="flex items-center justify-between gap-4">
                {testimonial.image && (
                    <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <div>
                    <h2 className="font-semibold text-2xl">{testimonial.name}</h2>
                </div>
            </div>
            <button 
                onClick={() => handleDeleteTestimonial(testimonial.id)}
                disabled={isDeleting === testimonial.id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
                {isDeleting === testimonial.id ? 'Deleting...' : <IoMdClose size={20} />}
                
            </button>

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

export default TesminonialCard