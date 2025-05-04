
import React from 'react';

interface ContactPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const ContactPageSection: React.FC<ContactPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        {content.info && (
          <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.info)} />
        )}
        
        <div className="space-y-4 mb-8">
          {content.address && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Adres</h3>
              <div dangerouslySetInnerHTML={renderHtmlContent(content.address)} />
            </div>
          )}
          
          {content.phone && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Telefon</h3>
              <div dangerouslySetInnerHTML={renderHtmlContent(content.phone)} />
            </div>
          )}
          
          {content.email && (
            <div>
              <h3 className="text-lg font-semibold mb-2">E-posta</h3>
              <div dangerouslySetInnerHTML={renderHtmlContent(content.email)} />
            </div>
          )}
          
          {content.hours && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Çalışma Saatleri</h3>
              <div dangerouslySetInnerHTML={renderHtmlContent(content.hours)} />
            </div>
          )}
        </div>
      </div>
      
      <div>
        {content.map && (
          <div className="mb-8 w-full h-[400px]" dangerouslySetInnerHTML={renderHtmlContent(content.map)} />
        )}
      </div>
    </div>
  );
};

export default ContactPageSection;
