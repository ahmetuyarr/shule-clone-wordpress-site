
import React from 'react';

interface FaqPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const FaqPageSection: React.FC<FaqPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div>
      {content.intro && (
        <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
      )}
      
      {content.faqs && (
        <div className="py-6" dangerouslySetInnerHTML={renderHtmlContent(content.faqs)} />
      )}
    </div>
  );
};

export default FaqPageSection;
