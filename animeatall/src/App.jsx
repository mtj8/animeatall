import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './App.css'
import PostCard from './Components/PostCard.jsx'

import { supabase } from './client.jsx';

function App() {
  const [posts, setPosts] = useState(null);
  const [displayPosts, setDisplayPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('recent'); // Default sort is most recent
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
        setDisplayPosts(data); // Initialize displayPosts with the fetched data
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Handle sorting and filtering when sortType changes, posts update, or searchTerm changes
  useEffect(() => {
    if (!posts) return;
    
    // First filter posts based on search term
    let filteredPosts = posts;
    if (searchTerm) {
      filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Then sort the filtered posts
    let sortedPosts = [...filteredPosts];
    
    if (sortType === 'recent') {
      sortedPosts.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortType === 'upvotes') {
      sortedPosts.sort((a, b) => b.upvotes - a.upvotes);
    }
    
    setDisplayPosts(sortedPosts);
  }, [sortType, posts, searchTerm]);

  const handleSort = (type) => {
    setSortType(type);
  };

  return (
    <>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {searchTerm && (
            <h2>Search results for: "{searchTerm}"</h2>
          )}
          <h1 style={{marginBottom:3, marginTop:1}}>Sort Posts</h1>
          <div className="sort-buttons">
            <button 
              onClick={() => handleSort('recent')}
              className={sortType === 'recent' ? 'active' : ''}
            >
              Most Recent
            </button>
            <button 
              onClick={() => handleSort('upvotes')}
              className={sortType === 'upvotes' ? 'active' : ''}
            >
              Most Upvotes
            </button>
          </div>
          <hr></hr>
          <div className="posts">
            {displayPosts && displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <div key={post.id}>
                  <Link to={`/view/${post.id}`}>
                    <PostCard post={post} key={post.id} />
                  </Link>
                  <hr></hr>
                </div>
              ))
            ) : (
              <p>No posts found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default App