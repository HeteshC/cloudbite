import { CalendarDays, Folder } from 'lucide-react';
import img1 from "../../assets/food_1.png";
import img2 from "../../assets/food_2.png";
import img3 from "../../assets/food_3.png";

const blogPosts = [
  {
    date: '22 AUG 2021',
    category: 'TIPS & TRICKS',
    title: 'Top 10 casual look ideas to dress up your kids',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam...',
    image: img1,
  },
  {
    date: '25 AUG 2021',
    category: 'TRENDING',
    title: 'Latest trends of wearing street wears supremely',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam...',
    image: img2,
  },
  {
    date: '28 AUG 2021',
    category: 'INSPIRATION',
    title: '10 Different Types of comfortable clothes ideas for women',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam...',
    image: img3,
  },
];

const RecentBlog = () => {
  return (
    <section className="px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Our Recent Blog</h2>
        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">View All</button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <img src={post.image} alt={post.title} className="rounded-md w-full h-40 object-cover mb-4" />
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Folder className="w-4 h-4" />
                <span>{post.category}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentBlog;
