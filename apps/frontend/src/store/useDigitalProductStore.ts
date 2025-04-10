import axios from "axios";
import { create } from "zustand";
import { PaymentSession } from "./useTelegramStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface PublicDigitalProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'FIXED' | 'FLEXIBLE';
  coverImage: string;
  themeColor: string;
  hasDiscount: boolean;
  discountedPrice: number;
  ctaButtonText: string;
  testimonials: Testimonial[];
  faqs: FAQ[];
  creator: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}
// Define interfaces based on the schema
export interface DigitalFile {
  id: string;
  fileType: 'PDF' | 'IMAGE' | 'VIDEO' | 'LINK' | 'DOCUMENT' | 'AUDIO' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  s3Key: string;
}

export interface Testimonial {
  id: string;
  name: string;
  image?: string;
  description: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  imageOrder?: number;
  imageType: 'IMAGE' | 'VIDEO';
  imageName?: string;
}

export interface RegistrationQuestion {
  id: string;
  question: string;
  fieldType: 'TEXT' | 'DROPDOWN' | 'RADIO' | 'CHECKBOX' | 'DATE' | 'EMAIL' | 'PHONE' | 'NUMBER';
  fieldOptions: string[];
  isRequired: boolean;
}

export interface SupportDetail {
  id: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
}

export interface DigitalProduct {
  id: string;
  creatorId: number;
  title: string;
  description?: string;
  category?: string;
  coverImage?: string;
  themeColor?: string;
  priceType?: 'FIXED' | 'FLEXIBLE';
  price: string;
  discountedPrice?: string;
  hasDiscount: boolean;
  ctaButtonText?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isLimitedQuantityEnabled: boolean;
  quantity?: number;
  image?: string;
  _count: {
    orders: number;
  };
  files: DigitalFile[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  galleryImages: GalleryImage[];
  registrationQns: RegistrationQuestion[];
  supportDetails: SupportDetail[];
  createdAt: string;
}

interface DigitalProductState {
  products: DigitalProduct[];
  currentProduct: DigitalProduct | null;
  isLoading: boolean;
  error: string | null;
  
  // Product Methods
  createProduct: (data: Partial<DigitalProduct>) => Promise<DigitalProduct>;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchPublicProductBySlug: (slug: string) => Promise<PublicDigitalProduct>;
  updateProduct: (id: string, data: Partial<DigitalProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setCurrentProduct: (product: DigitalProduct | null) => void;
  publishProduct: (id: string) => Promise<void>;
  unpublishProduct: (id: string) => Promise<void>;
  
  // File Methods
  getFileUploadUrl: (productId: string, fileName: string, fileType: string) => Promise<{
    uploadUrl: string;
    s3Key: string;
    fileType: string;
  }>;
  uploadFileToS3: (url: string, file: File) => Promise<void>;
  uploadDigitalProductFile: (productId: string, s3Key: string, fileType: string) => Promise<void>;
  getDigitalProductFiles: (productId: string) => Promise<DigitalFile[]>;
  deleteFile: (productId: string, fileId: string) => Promise<void>;
  
  // Testimonial Methods
  createTestimonial: (productId: string, data: Partial<Testimonial>) => Promise<Testimonial>;
  getTestimonials: (productId: string) => Promise<Testimonial[]>;
  updateTestimonial: (testimonialId: string, data: Partial<Testimonial>) => Promise<Testimonial>;
  deleteTestimonial: (testimonialId: string) => Promise<void>;
  
  // FAQ Methods
  createFaq: (productId: string, data: Partial<FAQ>) => Promise<FAQ>;
  getFaqs: (productId: string) => Promise<FAQ[]>;
  updateFaq: (faqId: string, data: Partial<FAQ>) => Promise<FAQ>;
  deleteFaq: (faqId: string) => Promise<void>;
  
  // Registration Question Methods
  createRegistrationQuestion: (productId: string, data: Partial<RegistrationQuestion>) => Promise<RegistrationQuestion>;
  getRegistrationQuestions: (productId: string) => Promise<RegistrationQuestion[]>;
  updateRegistrationQuestion: (questionId: string, data: Partial<RegistrationQuestion>) => Promise<RegistrationQuestion>;
  deleteRegistrationQuestion: (questionId: string) => Promise<void>;
  
  // Support Detail Methods
  createSupportDetail: (productId: string, data: Partial<SupportDetail>) => Promise<SupportDetail>;
  getSupportDetails: (productId: string) => Promise<SupportDetail[]>;
  updateSupportDetail: (detailId: string, data: Partial<SupportDetail>) => Promise<SupportDetail>;
  deleteSupportDetail: (detailId: string) => Promise<void>;

  //Cover Image for Digital Product
  getUploadCoverUrl: (productId: string, fileName: string, fileType: string) => Promise<{uploadUrl: string, s3Key: string}>
  uploadCoverImage: (productId: string, s3Key: string) => Promise<void>
  getCoverImage: (productId: string) => Promise<string | null>

  //payment
  initiatePurchase: (productId: string, customAmount?: number) => Promise<PaymentSession>;
  handlePaymentCallback: (orderId: string, productType: string) => Promise<string>;
  
}

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to safely update the current product
const safelyUpdateCurrentProduct = (
  get: () => DigitalProductState,
  updateFn: (product: NonNullable<DigitalProductState['currentProduct']>) => void
) => {
  const currentProduct = get().currentProduct;
  if (currentProduct) {
    updateFn(currentProduct);
  }
};

export const useDigitalProductStore = create<DigitalProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  // Product Methods
  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/v1/digital-products', data);
      const newProduct = response.data.data;
      set(state => ({
        products: [newProduct,...state.products],
        currentProduct: newProduct,
        isLoading: false
      }));
      return newProduct;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create product', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/v1/digital-products');
      set({ 
        products: response.data.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${id}`);
      const product = response.data.data;
      set({ 
        currentProduct: product,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product', 
        isLoading: false 
      });
      throw error;
    }
  },

  fetchPublicProductBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/public/${slug}`);
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch public product', 
        isLoading: false 
      });
      throw error;
    }
  },  

  updateProduct: async (id: string, data: Partial<DigitalProduct>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/digital-products/${id}`, data);
      const updatedProduct = response.data.data;
      
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === id 
          ? updatedProduct 
          : state.currentProduct,
        isLoading: false
      }));
      return updatedProduct;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update product', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/${id}`);
      
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        currentProduct: state.currentProduct?.id === id 
          ? null 
          : state.currentProduct,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete product', 
        isLoading: false 
      });
      throw error;
    }
  },

  setCurrentProduct: (product) => {
    set({ currentProduct: product });
  },

  publishProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${id}/publish`);
      const updatedProduct = response.data.data;
      
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === id 
          ? updatedProduct 
          : state.currentProduct,
        isLoading: false
      }));
      return updatedProduct;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to publish product', 
        isLoading: false 
      });
      throw error;
    }
  },

  unpublishProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${id}/unpublish`);
      const updatedProduct = response.data.data;
      
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === id 
          ? updatedProduct 
          : state.currentProduct,
        isLoading: false
      }));
      return updatedProduct;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to unpublish product', 
        isLoading: false 
      });
      throw error;
    }
  },

  // File Methods
  getFileUploadUrl: async (productId: string, fileName: string, fileType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/uploadUrl`, {
        fileName,
        fileType
      });
      
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get upload URL', 
        isLoading: false 
      });
      throw error;
    }
  },

  uploadFileToS3: async (url: string, file: File) => {
    set({ isLoading: true, error: null });
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload file to S3', 
        isLoading: false 
      });
      throw error;
    }
  },

  uploadDigitalProductFile: async (productId: string, s3Key: string, fileType: string) => { 
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/uploadFile`, {
        s3Key,
        fileType
      });

      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload digital product file', 
        isLoading: false 
      });
      throw error;
    }
  },

  getDigitalProductFiles: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/files`);
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get digital product files', 
        isLoading: false 
      });
      throw error;
    }
  },  

  deleteFile: async (productId: string, fileId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/${productId}/files/${fileId}`);
      
      // Update currentProduct if it exists and matches the productId
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          const updatedFiles = currentProduct.files.filter(file => file.id !== fileId);
          set(() => ({
            currentProduct: {
              ...currentProduct,
              files: updatedFiles
            }
          }));
        }
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete file', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Testimonial Methods
  createTestimonial: async (productId: string, data: Partial<Testimonial>) => {
    set({ isLoading: true, error: null });
    try {
      console.log(data);
      const response = await api.post(`/api/v1/digital-products/${productId}/testimonials`, data);
      const newTestimonial = response.data.data;
      console.log(newTestimonial);
      
      // Update currentProduct if it exists and matches the productId
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          set(() => ({
            currentProduct: {
              ...currentProduct,
              testimonials: [...currentProduct.testimonials, newTestimonial]
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return newTestimonial;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create testimonial', 
        isLoading: false 
      });
      throw error;
    }
  },

  getTestimonials: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/testimonials`);
      const testimonials = response.data.data;
      
      set({ isLoading: false });
      return testimonials;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch testimonials', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateTestimonial: async (testimonialId: string, data: Partial<Testimonial>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/digital-products/testimonials/${testimonialId}`, data);
      const updatedTestimonial = response.data.data;
      
      // Update currentProduct if it exists and contains this testimonial
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const testimonialIndex = currentProduct.testimonials.findIndex(
          t => t.id === testimonialId
        );
        
        if (testimonialIndex !== -1) {
          const updatedTestimonials = [...currentProduct.testimonials];
          updatedTestimonials[testimonialIndex] = updatedTestimonial;
          
          set(() => ({
            currentProduct: {
              ...currentProduct,
              testimonials: updatedTestimonials
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return updatedTestimonial;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update testimonial', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTestimonial: async (testimonialId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/testimonials/${testimonialId}`);
      
      // Update currentProduct if it exists and contains this testimonial
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const updatedTestimonials = currentProduct.testimonials.filter(
          t => t.id !== testimonialId
        );
        
        set(() => ({
          currentProduct: {
            ...currentProduct,
            testimonials: updatedTestimonials
          }
        }));
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete testimonial', 
        isLoading: false 
      });
      throw error;
    }
  },

  // FAQ Methods
  createFaq: async (productId: string, data: Partial<FAQ>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/faqs`, data);
      const newFaq = response.data.data;
      
      // Update currentProduct if it exists and matches the productId
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          set(() => ({
            currentProduct: {
              ...currentProduct,
              faqs: [...currentProduct.faqs, newFaq]
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return newFaq;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create FAQ', 
        isLoading: false 
      });
      throw error;
    }
  },

  getFaqs: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/faqs`);
      const faqs = response.data.data;
      
      set({ isLoading: false });
      return faqs;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch FAQs', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateFaq: async (faqId: string, data: Partial<FAQ>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/digital-products/faqs/${faqId}`, data);
      const updatedFaq = response.data.data;
      
      // Update currentProduct if it exists and contains this FAQ
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const faqIndex = currentProduct.faqs.findIndex(f => f.id === faqId);
        
        if (faqIndex !== -1) {
          const updatedFaqs = [...currentProduct.faqs];
          updatedFaqs[faqIndex] = updatedFaq;
          
          set(() => ({
            currentProduct: {
              ...currentProduct,
              faqs: updatedFaqs
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return updatedFaq;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update FAQ', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteFaq: async (faqId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/faqs/${faqId}`);
      
      // Update currentProduct if it exists and contains this FAQ
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const updatedFaqs = currentProduct.faqs.filter(f => f.id !== faqId);
        
        set(() => ({
          currentProduct: {
            ...currentProduct,
            faqs: updatedFaqs
          }
        }));
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete FAQ', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Registration Question Methods
  createRegistrationQuestion: async (productId: string, data: Partial<RegistrationQuestion>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/registration-questions`, data);
      const newQuestion = response.data.data;
      
      // Update currentProduct if it exists and matches the productId
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          set(() => ({
            currentProduct: {
              ...currentProduct,
              registrationQns: [...currentProduct.registrationQns, newQuestion]
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return newQuestion;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create registration question', 
        isLoading: false 
      });
      throw error;
    }
  },

  getRegistrationQuestions: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/registration-questions`);
      const questions = response.data.data;
      
      set({ isLoading: false });
      return questions;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch registration questions', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateRegistrationQuestion: async (questionId: string, data: Partial<RegistrationQuestion>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/digital-products/registration-questions/${questionId}`, data);
      const updatedQuestion = response.data.data;
      
      // Update currentProduct if it exists and contains this question
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const questionIndex = currentProduct.registrationQns.findIndex(
          q => q.id === questionId
        );
        
        if (questionIndex !== -1) {
          const updatedQuestions = [...currentProduct.registrationQns];
          updatedQuestions[questionIndex] = updatedQuestion;
          
          set(() => ({
            currentProduct: {
              ...currentProduct,
              registrationQns: updatedQuestions
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return updatedQuestion;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update registration question', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteRegistrationQuestion: async (questionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/registration-questions/${questionId}`);
      
      // Update currentProduct if it exists and contains this question
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const updatedQuestions = currentProduct.registrationQns.filter(
          q => q.id !== questionId
        );
        
        set(() => ({
          currentProduct: {
            ...currentProduct,
            registrationQns: updatedQuestions
          }
        }));
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete registration question', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Support Detail Methods
  createSupportDetail: async (productId: string, data: Partial<SupportDetail>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/support-details`, data);
      const newDetail = response.data.data;
      
      // Update currentProduct if it exists and matches the productId
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          set(() => ({
            currentProduct: {
              ...currentProduct,
              supportDetails: [...currentProduct.supportDetails, newDetail]
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return newDetail;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create support detail', 
        isLoading: false 
      });
      throw error;
    }
  },

  getSupportDetails: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/support-details`);
      const details = response.data.data;
      
      set({ isLoading: false });
      return details;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch support details', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateSupportDetail: async (detailId: string, data: Partial<SupportDetail>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/digital-products/support-details/${detailId}`, data);
      const updatedDetail = response.data.data;
      
      // Update currentProduct if it exists and contains this detail
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const detailIndex = currentProduct.supportDetails.findIndex(
          d => d.id === detailId
        );
        
        if (detailIndex !== -1) {
          const updatedDetails = [...currentProduct.supportDetails];
          updatedDetails[detailIndex] = updatedDetail;
          
          set(() => ({
            currentProduct: {
              ...currentProduct,
              supportDetails: updatedDetails
            }
          }));
        }
      });
      
      set({ isLoading: false });
      return updatedDetail;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update support detail', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteSupportDetail: async (detailId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/v1/digital-products/support-details/${detailId}`);
      
      // Update currentProduct if it exists and contains this detail
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        const updatedDetails = currentProduct.supportDetails.filter(
          d => d.id !== detailId
        );
        
        set(() => ({
          currentProduct: {
            ...currentProduct,
            supportDetails: updatedDetails
          }
        }));
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete support detail', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Cover Image Methods
  getUploadCoverUrl: async (productId: string, fileName: string, fileType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/coverUrl`, {
        fileName,
        fileType
      });
      
      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get cover upload URL', 
        isLoading: false 
      });
      throw error;
    }
  },

  uploadCoverImage: async (productId: string, s3Key: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/api/v1/digital-products/${productId}/uploadCoverImage`, {
        s3Key
      });

      // Update currentProduct if it exists
      safelyUpdateCurrentProduct(get, (currentProduct) => {
        if (currentProduct.id === productId) {
          set(() => ({
            currentProduct: {
              ...currentProduct,
              coverImage: response.data.data.coverImage
            }
          }));
        }
      });

      set({ isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload cover image', 
        isLoading: false 
      });
      throw error;
    }
  },

  getCoverImage: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/digital-products/${productId}/coverImage`);
      set({ isLoading: false });
      return response.data.data.url;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get cover image', 
        isLoading: false 
      });
      return null;
    }
  },

  initiatePurchase: async (productId: string, customAmount?: number) => {
    set({ isLoading: true, error: null });
    try {
      // If customAmount is provided, send it to the backend
      const payload = customAmount ? { customAmount } : {};
      
      const response = await api.post(
        `/api/v1/digital-products/${productId}/purchase`, 
        payload
      );
      
      // Extract payment session data
      const paymentData = response.data.data;
      set({ isLoading: false });
      
      // Return payment session for redirect
      return paymentData;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initiate purchase', 
        isLoading: false 
      });
      throw error;
    }
  },

  handlePaymentCallback: async (orderId: string, productType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/orders/payment-callback?orderId=${orderId}&productType=${productType}`);
      set({ isLoading: false });  
      return response.data.status;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to handle payment callback', 
        isLoading: false 
      });
      throw error;
    }
  }
  
})); 