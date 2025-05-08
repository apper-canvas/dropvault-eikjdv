import { useState } from 'react'
import { toast } from 'react-toastify'
import PageLayout from '../components/PageLayout'
import contactMessageService from '../services/contactMessageService'
import getIcon from '../utils/iconUtils'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Prepare message data for backend
      const messageData = {
        Name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      };
      
      // Send message to backend
      contactMessageService.createContactMessage(messageData)
        .then(response => {
          toast.success('Your message has been sent successfully!', {
            icon: "✅"
          });
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
        })
        .catch(error => {
          console.error('Error sending message:', error);
          toast.error('Failed to send message. Please try again later.');
        })
        
        setIsSubmitting(false)
      }, 1500)
    } else {
      toast.error('Please fix the errors in the form.', {
        icon: "❌"
      })
    }
  }
  
  return (
    <PageLayout 
      title="Contact Us" 
      subtitle="Have questions or need help? We're here for you."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500 dark:border-red-400' : 'border-surface-300 dark:border-surface-600'} 
                  bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-surface-300 dark:border-surface-600'} 
                  bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${errors.subject ? 'border-red-500 dark:border-red-400' : 'border-surface-300 dark:border-surface-600'} 
                  bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`}
              />
              {errors.subject && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.subject}</p>}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${errors.message ? 'border-red-500 dark:border-red-400' : 'border-surface-300 dark:border-surface-600'} 
                  bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none`}
              ></textarea>
              {errors.message && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
        
        <div className="card bg-surface-50 dark:bg-surface-800 space-y-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <MailIcon className="w-5 h-5 mr-2 text-primary" />
              Email Us
            </h3>
            <a href="mailto:support@dropvault.com" className="text-primary hover:text-primary-dark dark:hover:text-primary-light">
              support@dropvault.com
            </a>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-primary" />
              Call Us
            </h3>
            <a href="tel:+18005551234" className="text-primary hover:text-primary-dark dark:hover:text-primary-light">
              +1 (800) 555-1234
            </a>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary" />
              Our Office
            </h3>
            <address className="not-italic text-surface-700 dark:text-surface-300">
              123 Tech Street<br />
              San Francisco, CA 94107<br />
              United States
            </address>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-primary" />
              Business Hours
            </h3>
            <p className="text-surface-700 dark:text-surface-300">
              Monday - Friday: 9am - 5pm PST<br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

const MailIcon = getIcon("Mail")
const PhoneIcon = getIcon("Phone")
const MapPinIcon = getIcon("MapPin")
const ClockIcon = getIcon("Clock")
const LoaderIcon = getIcon("Loader")