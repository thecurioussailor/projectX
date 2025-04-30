import { useDigitalProduct } from "../../hooks/useDigitalProduct";
import { useState } from "react";
import { DigitalProduct } from "../../store/useDigitalProductStore";
import { IoIosAdd } from "react-icons/io";
import TesminonialCard from "../ui/TesminonialCard";

interface TestimonialsProps {
    currentProduct: DigitalProduct;
}

const Testimonials = ({ currentProduct }: TestimonialsProps) => {
    const { deleteTestimonial } = useDigitalProduct();
    const [showForm, setShowForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Use testimonials directly from the currentProduct
    const testimonials = currentProduct.testimonials;

    const handleDeleteTestimonial = async (id: string) => {
        try {
            setIsDeleting(id);
            await deleteTestimonial(id);
        } catch (err) {
            console.error("Failed to delete testimonial:", err);
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 border rounded-3xl">
            <div className="flex items-center gap-4 border-b py-8 px-8">
                <h1 className="text-2xl font-semibold text-purple-600">Testimonials</h1>
            </div>
            <div className="flex items-center gap-4 px-6 pt-4">
                <button 
                    onClick={() => setShowForm(true)}
                    className="text-zinc-500 flex items-center gap-2 border border-dashed border-zinc-500 rounded-full pl-2 pr-4 py-1"
                >
                    <IoIosAdd size={20} /> Add Testimonial
                </button>
            </div>
            
            {showForm && (
                <CreateTestimonialForm 
                    currentProduct={currentProduct} 
                    onClose={() => setShowForm(false)}
                    onSuccess={() => setShowForm(false)}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
                {testimonials.map((testimonial) => (
                    <TesminonialCard 
                        key={testimonial.id}
                        testimonial={testimonial}
                        handleDeleteTestimonial={handleDeleteTestimonial}
                        isDeleting={isDeleting}
                    />
                ))}
            </div>
        </div>
    );
};

interface CreateTestimonialFormProps {
    currentProduct: DigitalProduct;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateTestimonialForm = ({ currentProduct, onClose, onSuccess }: CreateTestimonialFormProps) => {
    const { createTestimonial } = useDigitalProduct();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rating: 5,
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            await createTestimonial(currentProduct.id, formData);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create testimonial');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 shadow-md rounded-3xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Add Testimonial</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4"> 
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                        <input
                            type="number"
                            id="rating"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                        <input
                            type="url"
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full p-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#7F37D8] text-white rounded-3xl hover:bg-[#6C2EB9] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Testimonial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Testimonials;

