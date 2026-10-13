import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/clubData.ts';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

interface BlogViewProps {
  initialSlug?: string;
  navigate: (route: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, navigate }) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = ['all', 'Athletic Science', 'Academy News', 'Nutrition & Wellness'];

  const selectedPost = BLOG_POSTS.find((p) => p.slug === selectedSlug);

  const filteredPosts = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // If a single post is being viewed
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-[#F8FAFC]">
        <button
          onClick={() => setSelectedSlug(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A192F] hover:text-[#162B4D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Blog</span>
        </button>

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-200 pb-6 bg-white p-6 sm:p-8 rounded-sm shadow-sm">
          <div className="flex items-center gap-2 text-xs text-[#0A192F] font-mono uppercase tracking-widest font-semibold">
            <span>{selectedPost.category}</span>
            <span>·</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <h1 className="font-royal text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">{selectedPost.author.name}</div>
                <div className="text-xs text-slate-500">{selectedPost.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">{selectedPost.date}</span>
              <button
                onClick={handleShare}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-sm text-slate-600 hover:text-black transition-colors"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-[#0A192F] font-semibold">Link Copied!</span>}
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-[16/9] rounded-sm overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        <div className="p-6 rounded-sm bg-white border border-slate-200 space-y-3 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-bold">
            Sports Science Key Takeaways
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {selectedPost.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 bg-white p-6 sm:p-8 rounded-sm border border-slate-200 shadow-sm">
          {selectedPost.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    );
  }

  // Blog Directory
  return (
    <div className="space-y-12 py-8 bg-[#F8FAFC]">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0A192F] font-semibold">
            Tiara Sports Blog · Athletic Sciences & Editorial
          </div>
          <h1 className="font-royal text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            ATHLETIC DISPATCHES & RESEARCH.
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Biomechanical movement analyses, nutrition protocols for Gujarat weather, tournament breakdowns, and academy dispatches by certified coaches.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#0A192F] text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-[#0A192F] hover:bg-slate-200/60'
              }`}
            >
              {cat === 'all' ? 'All Publications' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              onClick={() => setSelectedSlug(post.slug)}
              className="sports-module-card rounded-sm overflow-hidden flex flex-col justify-between cursor-pointer group bg-white"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#0A192F] font-mono">{post.category}</span>
                    <span className="font-mono">{post.readTime}</span>
                  </div>
                  <h3 className="font-royal text-base font-bold text-[#0F172A] group-hover:text-[#0A192F] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{post.author.name}</span>
                  <span className="font-semibold text-[#0A192F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
