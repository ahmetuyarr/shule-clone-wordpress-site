
import React from 'react';

interface ReturnsPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const ReturnsPageSection: React.FC<ReturnsPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div className="space-y-8">
      {content.intro && (
        <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
      )}
      
      {content.policies && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">İade Politikalarımız</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.policies)} />
        </div>
      )}
      
      {content.process && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">İade Süreci</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.process)} />
        </div>
      )}
      
      {content.conditions && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">İade Şartları</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.conditions)} />
        </div>
      )}
    </div>
  );
};

export default ReturnsPageSection;
