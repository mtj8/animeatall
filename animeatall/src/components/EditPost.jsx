import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client.jsx';

const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image_url, setImageUrl] = useState("");

    const [imageError, setImageError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select("*")
                    .eq('id', Number(postId))
                    .single();

                if (error) throw error;

                setPost(data);
                setTitle(data.title || "");
                setContent(data.content || "");
                setImageUrl(data.image_url || "");
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "title") {
            setTitle(value);
            setTitleError("");
        } else if (name === "content") {
            setContent(value);
        } else if (name === "image_url") {
            setImageUrl(value);
            setImageError("");
        }
    };

    const validateImageUrl = (url) => {
        // If URL is empty, it's valid (since it's optional)
        if (!url.trim()) {
            return Promise.resolve(true);
        }
        
        // Otherwise validate the URL
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true); // Image loaded successfully
            img.onerror = () => resolve(false); // Image failed to load
            img.src = url;
        });
    };

    const updatePost = async (e) => {
        e.preventDefault();

        // Validate title (required)
        if (!title.trim()) {
            setTitleError("Title is required.");
            return;
        }

        // Validate the image URL if it's not empty
        if (image_url.trim()) {
            const isValidImage = await validateImageUrl(image_url);
            if (!isValidImage) {
                setImageError("Invalid image URL.");
                return;
            }
        }

        const { error } = await supabase
            .from('posts')
            .update({ 
                title: title,
                content: content,
                image_url: image_url.trim() || null
            })
            .eq('id', post.id);

        if (error) {
            console.error("Error updating post:", error);
        } else {
            navigate(`/view/${post.id}`);
        }
    };
    
    const deletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setIsDeleting(true);
            
            try {
                // delete the post itself
                const { error } = await supabase
                    .from('posts')
                    .delete()
                    .eq('id', Number(postId));
                
                if (error) throw error;
                
                navigate('/'); // Redirect to home page after successful deletion
            } catch (err) {
                console.error("Error deleting post:", err);
                setError("Failed to delete post. Please try again.");
                setIsDeleting(false);
            }
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {post && (
                <>
                    <h2>Edit Post</h2>
                    <hr></hr>
                    <form onSubmit={updatePost}>
                        <label htmlFor="title">Title<b style={{color:'red'}}>*</b></label>
                        <br></br>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            required
                        />
                        {titleError && <span style={{ color: "red", marginLeft: "10px" }}>{titleError}</span>}

                        <br></br>

                        <label htmlFor="content">Content (optional)</label>
                        <br></br>
                        <textarea
                            cols="30"
                            rows="10"
                            id="content"
                            name="content"
                            value={content}
                            onChange={handleChange}
                        ></textarea>

                        <br></br>

                        <label htmlFor="image_url">Image URL (optional)</label>
                        <br></br>
                        <input
                            type="text"
                            id="image_url"
                            name="image_url"
                            value={image_url}
                            onChange={handleChange}
                        />
                        {imageError && <span style={{ color: "red", marginLeft: "10px" }}>{imageError}</span>}

                        <br></br>

                        <button type="submit" className="submit-button">Update Post</button>
                    </form>
                    <button 
                        onClick={deletePost} 
                        className="delete-button"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Post"}
                    </button>
                </>
            )}
        </div>
    );
}

export default EditPost;