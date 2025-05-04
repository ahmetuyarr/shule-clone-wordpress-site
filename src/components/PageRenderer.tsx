
import React from 'react';
import AboutPageSection from './page-sections/AboutPageSection';
import ContactPageSection from './page-sections/ContactPageSection';
import FaqPageSection from './page-sections/FaqPageSection';
import ShippingPageSection from './page-sections/ShippingPageSection';
import ReturnsPageSection from './page-sections/ReturnsPageSection';
import SizingPageSection from './page-sections/SizingPageSection';
import DefaultPageSection from './page-sections/DefaultPageSection';

interface PageRendererProps {
  pageKey: string;
  content: Record<string, any>;
  renderHtmlContent: (html: string) => { __html: string };
}

const PageRenderer: React.FC<PageRendererProps> = ({ pageKey, content, renderHtmlContent }) => {
  switch (pageKey) {
    case 'about':
      return <AboutPageSection content={content} renderHtmlContent={renderHtmlContent} />;
      
    case 'contact':
      return <ContactPageSection content={content} renderHtmlContent={renderHtmlContent} />;
      
    case 'faq':
      return <FaqPageSection content={content} renderHtmlContent={renderHtmlContent} />;

    case 'shipping':
      return <ShippingPageSection content={content} renderHtmlContent={renderHtmlContent} />;
      
    case 'returns':
      return <ReturnsPageSection content={content} renderHtmlContent={renderHtmlContent} />;
      
    case 'sizing':
      return <SizingPageSection content={content} renderHtmlContent={renderHtmlContent} />;
      
    case 'privacy':
    case 'terms':
    case 'products':
    case 'collections':
    case 'bestsellers':
    case 'new':
    default:
      return <DefaultPageSection content={content} renderHtmlContent={renderHtmlContent} />;
  }
};

export default PageRenderer;
