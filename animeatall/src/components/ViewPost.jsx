import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client.jsx';

import { formatDistanceToNow } from 'date-fns';

const viewPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {

            const { data } = await supabase
                .from('posts')
                .select("*")
                .eq('id', Number(postId))
                .single();
            
            setPost(data);
        };

        fetchPost();
    }, [postId]);

    const [isUpvoting, setIsUpvoting] = useState(false);
    const handleUpvote = async () => {
        if (!post || isUpvoting) return;
        
        setIsUpvoting(true);
        
        const newUpvotes = post.upvotes + 1;
        
        const { error } = await supabase
            .from('posts')
            .update({ upvotes: newUpvotes })
            .eq('id', post.id);
            
        if (error) {
            console.error("Error updating upvotes:", error);
        } else {
            // Update local state only after successful DB update
            setPost({ ...post, upvotes: newUpvotes });
        }
        
        setIsUpvoting(false);
    };


    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('comments')
                .select("*")
                .eq('post_id', Number(postId));

            if (error) {
                console.error("Error fetching comments:", error);
            } else {
                setComments(data);
            }
        };

        fetchComments();
    }, [postId]);

    return (
        <div>
            {post ? ( // Only render the post content if post is not null
                <div className="post-content">
                    <div className="post-content-header">
                        <h1>{post.title}</h1>
                        <button 
                            onClick={() => navigate(`/edit/${post.id}`)} 
                            className="edit-button"
                        >
                            Edit Post
                        </button>                    
                    </div>
                    <h3>{post.content}</h3>
                    <button 
                            onClick={handleUpvote} 
                            disabled={isUpvoting}
                            className="upvote-button"
                        >
                            {isUpvoting ? 'Upvoting...' : `Upvote (${post.upvotes})`}
                    </button>
                    <br></br>
                    { post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
                </div>
            ) : (
                <p>loading...</p> // Show a loading message while fetching
            )} 
            <hr></hr>
            <div className="comments-section">
                <h3>Comments</h3>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <p>{comment.comment}</p>
                            <p>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</p>
                        </div>
                    ))
                ) : (
                    <p>nobody's said anything yet</p>
                )}
                <form
                    onSubmit={(e) => e.preventDefault()} // Prevent default form submission
                >
                    <textarea
                        value={newComment}
                        cols="20"
                        rows="1"
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="what do you think?"
                        required
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) { // Check if Enter is pressed without Shift
                                e.preventDefault(); // Prevent adding a new line

                                const { data, error } = await supabase
                                    .from('comments')
                                    .insert({
                                        post_id: Number(postId),
                                        comment: newComment,
                                    })
                                    .select("*");

                                if (error) {
                                    console.error("Error adding comment:", error);
                                } else {
                                    setComments((prevComments) => [...prevComments, data[0]]);
                                    setNewComment(""); // Clear the input field
                                }
                            }
                        }}
                    ></textarea>
                </form>
            </div>
        </div>
    );
}

export default viewPost;