
import React from 'react';

interface AboutPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const AboutPageSection: React.FC<AboutPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div className="space-y-8">
      {content.intro && (
        <div className="mb-8" dangerouslySetInnerHTML={renderHtmlContent(content.intro)} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
        {content.mission && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
            <div dangerouslySetInnerHTML={renderHtmlContent(content.mission)} />
          </div>
        )}
        {content.vision && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
            <div dangerouslySetInnerHTML={renderHtmlContent(content.vision)} />
          </div>
        )}
      </div>
      
      {content.story && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Hikayemiz</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.story)} />
        </div>
      )}
      
      {content.team && (
        <div className="py-6">
          <h2 className="text-2xl font-semibold mb-4">Ekibimiz</h2>
          <div dangerouslySetInnerHTML={renderHtmlContent(content.team)} />
        </div>
      )}
    </div>
  );
};

export default AboutPageSection;
