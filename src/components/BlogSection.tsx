import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Essential Tips for Planning Your Dream Indian Wedding",
    excerpt: "From choosing the perfect venue to coordinating multiple ceremonies, discover the secrets to planning a flawless Indian wedding celebration that honors tradition while embracing modern elegance.",
    image: "https://images.unsplash.com/photo-1680490961937-e933bf1ef920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwY2VyZW1vbnl8ZW58MXx8fHwxNzY2NTcyOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Planning",
    date: "December 20, 2024",
    readTime: "8 min read",
    author: "Priya Sharma",
    featured: true,
  },
  {
    id: 2,
    title: "Wedding Planning Timeline: Your 12-Month Checklist",
    excerpt: "Stay organized and stress-free with our comprehensive month-by-month wedding planning guide. Learn what to prioritize at each stage of your journey.",
    image: "https://images.unsplash.com/photo-1760669343328-d84fbde15b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGxhbm5pbmclMjB0aXBzfGVufDF8fHx8MTc2NjU5OTI1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Planning",
    date: "December 18, 2024",
    readTime: "10 min read",
    author: "Rahul Verma",
  },
  {
    id: 3,
    title: "2025 Wedding Decoration Trends You'll Love",
    excerpt: "Discover the hottest decoration trends for 2025, from sustainable florals to innovative lighting designs that create magical atmospheres.",
    image: "https://images.unsplash.com/photo-1752857015591-c1b85c01c461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZGVjb3JhdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzY2NTQxMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Decor",
    date: "December 15, 2024",
    readTime: "6 min read",
    author: "Ananya Desai",
  },
  {
    id: 4,
    title: "Choosing the Perfect Wedding Venue: A Complete Guide",
    excerpt: "Your venue sets the tone for your entire celebration. Learn how to choose a location that reflects your style and accommodates your guest list.",
    image: "https://images.unsplash.com/photo-1578730169862-749bbdc763a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmVudWUlMjBvdXRkb29yfGVufDF8fHx8MTc2NjUxNjUyOHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Venue",
    date: "December 12, 2024",
    readTime: "7 min read",
    author: "Karan Mehta",
  },
  {
    id: 5,
    title: "Bridal Fashion: Finding Your Perfect Wedding Look",
    excerpt: "From traditional lehengas to contemporary fusion wear, explore how to choose wedding attire that makes you feel confident and beautiful.",
    image: "https://images.unsplash.com/photo-1637829855946-0795557bfb69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZHJlc3MlMjBicmlkZXxlbnwxfHx8fDE3NjY1OTkyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    date: "December 10, 2024",
    readTime: "9 min read",
    author: "Meera Kapoor",
  },
  {
    id: 6,
    title: "Floral Design Trends: Creating Stunning Wedding Arrangements",
    excerpt: "Discover how to incorporate seasonal blooms and unique arrangements to create breathtaking floral designs for your special day.",
    image: "https://images.unsplash.com/photo-1664312696723-173130983e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGJvdXF1ZXR8ZW58MXx8fHwxNzY2NTQwNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Decor",
    date: "December 8, 2024",
    readTime: "5 min read",
    author: "Sanjay Patel",
  },
];

const categories = ["All", "Planning", "Decor", "Venue", "Fashion"];

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-6 py-2 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 rounded-full text-sm tracking-wider">
              INSPIRATION & IDEAS
            </span>
          </motion.div>
          <h2 className="font-serif text-rose-900 mb-4">Wedding Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert advice, inspiration, and insights to help you plan the wedding of your dreams
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-rose-200 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <ImageWithFallback
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-amber-400 text-white rounded-full text-sm">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-rose-50 to-white flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-rose-500 text-sm">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-rose-900 mb-4 group-hover:text-rose-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">By {featuredPost.author}</span>
                    <button className="flex items-center gap-2 text-rose-500 group-hover:gap-4 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-rose-600 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="font-serif text-rose-900 mb-3 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-rose-100">
                    <span className="text-sm text-gray-600">By {post.author}</span>
                    <button className="flex items-center gap-2 text-rose-500 text-sm group-hover:gap-3 transition-all duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">
              No articles found. Try adjusting your search or filters.
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Load More Articles
            </button>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
        >
          <h3 className="font-serif text-white mb-4">Stay Inspired</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest wedding trends, planning tips, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-8 py-3 bg-white text-rose-600 rounded-full hover:bg-rose-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
