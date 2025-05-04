
import React from 'react';

interface ShippingPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const ShippingPageSection: React.FC<ShippingPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div className="space-y-8">
      {content.intro && (
        <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
      )}
      
      {content.policies && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Kargo Politikalarımız</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.policies)} />
        </div>
      )}
      
      {content.timeframes && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Teslimat Süreleri</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.timeframes)} />
        </div>
      )}
      
      {content.costs && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Kargo Ücretleri</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.costs)} />
        </div>
      )}
    </div>
  );
};

export default ShippingPageSection;
