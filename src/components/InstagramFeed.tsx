import React from 'react';
import { Instagram } from 'lucide-react';
interface InstagramPost {
  id: string;
  image: string;
  link: string;
}
interface InstagramFeedProps {
  posts: InstagramPost[];
}
const InstagramFeed: React.FC<InstagramFeedProps> = ({
  posts
}) => {
  return <section className="py-16 bg-shule-lightGrey">
      <div className="shule-container">
        <div className="text-center mb-12">
          <h2 className="shule-heading mb-3">Instagram</h2>
          <p className="shule-paragraph max-w-2xl mx-auto">
            Bizi Instagram'da takip edin ve son koleksiyonlarımızı keşfedin.
          </p>
          <a href="https://instagram.com/shulebags" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 mt-4 shule-link">
            <Instagram size={18} />
            <span>@ozelcantaturkiye</span>
          </a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {posts.map(post => <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className="block aspect-square relative group overflow-hidden">
              <img src={post.image} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram size={24} className="text-white" />
              </div>
            </a>)}
        </div>
      </div>
    </section>;
};
export default InstagramFeed;