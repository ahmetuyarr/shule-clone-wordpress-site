
import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-shule-beige">
      <div className="shule-container">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="shule-heading mb-3">E-Bültenimize Abone Olun</h2>
          <p className="shule-paragraph mb-6">
            Yeni ürünler, koleksiyonlar ve özel indirimlerden haberdar olmak için e-bültenimize abone olun.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="shule-input flex-grow py-3 px-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="shule-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Abone Ol'}
            </button>
          </form>
          
          {errorMessage && (
            <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
          )}
          
          {isSuccess && (
            <p className="mt-2 text-green-600 text-sm">
              Teşekkürler! E-bültenimize başarıyla abone oldunuz.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
