
import React from 'react';
import { Link } from 'react-router-dom';

interface PageBreadcrumbProps {
  title: string;
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ title }) => {
  return (
    <div className="bg-shule-lightGrey py-3">
      <div className="shule-container">
        <nav className="flex items-center flex-wrap">
          <Link to="/" className="shule-link">
            Ana Sayfa
          </Link>
          <span className="mx-1">/</span>
          <span>{title}</span>
        </nav>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
