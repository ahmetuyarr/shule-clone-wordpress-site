
import React from 'react';

interface DefaultPageSectionProps {
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const DefaultPageSection: React.FC<DefaultPageSectionProps> = ({ content, renderHtmlContent }) => {
  return (
    <div>
      {content.content ? (
        <div dangerouslySetInnerHTML={renderHtmlContent(content.content)} />
      ) : (
        Object.entries(content).map(([key, value]) => (
          <div key={key} dangerouslySetInnerHTML={renderHtmlContent(value as string)} />
        ))
      )}
    </div>
  );
};

export default DefaultPageSection;
