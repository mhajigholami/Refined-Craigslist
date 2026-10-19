import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft, PlusCircle, ThumbsUp, MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Forum: React.FC = () => {
  const { showToast } = useToast();
  const [topics, setTopics] = useState([
    { id: '1', title: 'Best practices for selling used cars in the Bay Area', author: 'Mark S.', replies: 14, time: '2 hours ago', category: 'automotive' },
    { id: '2', title: 'Safe public exchange spots around SF & Oakland', author: 'Elena R.', replies: 28, time: '5 hours ago', category: 'community' },
    { id: '3', title: 'Tips for spotting fake tenant verification scams', author: 'David L.', replies: 9, time: '1 day ago', category: 'housing' }
  ]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    setTopics(prev => [
      {
        id: `t-${Date.now()}`,
        title: newTopicTitle.trim(),
        author: 'Community Poster',
        replies: 0,
        time: 'Just now',
        category: 'general'
      },
      ...prev
    ]);
    setNewTopicTitle('');
    setShowNewTopic(false);
    showToast('Topic published to forum!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-gray-950 font-sans pb-24 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-700 dark:hover:text-purple-400 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Craigslist</span>
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif font-black text-2xl text-gray-900 dark:text-gray-100">
                  Community Discussion Forums
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Advice, conversations, and local Craigslist discussions.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNewTopic(!showNewTopic)}
              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Topic</span>
            </button>
          </div>

          {showNewTopic && (
            <form onSubmit={handleCreateTopic} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
              <h3 className="font-bold text-xs uppercase text-gray-600 dark:text-gray-300">Start a New Discussion</h3>
              <input
                type="text"
                placeholder="Topic title or question..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopic(false)}
                  className="px-3 py-1.5 text-xs text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-700 text-white rounded-xl text-xs font-bold"
                >
                  Post Topic
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {topics.map(topic => (
              <div
                key={topic.id}
                className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-purple-300 dark:hover:border-purple-600 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1 hover:text-purple-700 dark:hover:text-purple-400 cursor-pointer">
                    {topic.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>By {topic.author}</span>
                    <span>·</span>
                    <span>{topic.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>{topic.replies}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
