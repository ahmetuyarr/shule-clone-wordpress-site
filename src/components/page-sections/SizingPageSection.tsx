
import React from 'react';

interface SizingPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const SizingPageSection: React.FC<SizingPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div className="space-y-8">
      {content.intro && (
        <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
      )}
      
      {content.measurements && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Ölçü Tablosu</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.measurements)} />
        </div>
      )}
      
      {content.guide && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Ölçü Alma Rehberi</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.guide)} />
        </div>
      )}
      
      {content.tips && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Beden Seçme İpuçları</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.tips)} />
        </div>
      )}
    </div>
  );
};

export default SizingPageSection;
