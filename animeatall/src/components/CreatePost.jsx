import { supabase } from "../client.jsx";
import { useState } from "react";

const CreatePost = () => {
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        image_url: "",
        upvotes: 0,
    });

    const [imageError, setImageError] = useState(""); // State for validation message
    const [titleError, setTitleError] = useState(""); // State for title validation message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));

        // Clear the error messages when the user types
        if (name === "image_url") {
            setImageError("");
        }
        if (name === "title") {
            setTitleError("");
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

    const createNewPost = async (e) => {
        e.preventDefault();

        // Validate title (required)
        if (!newPost.title.trim()) {
            setTitleError("Title is required.");
            return;
        }

        // Validate the image URL if it's not empty
        if (newPost.image_url.trim()) {
            const isValidImage = await validateImageUrl(newPost.image_url);
            if (!isValidImage) {
                setImageError("Invalid image URL.");
                return;
            }
        }

        const { data, error } = await supabase
            .from("posts")
            .insert({
                title: newPost.title,
                content: newPost.content,
                image_url: newPost.image_url.trim() || null, // Use null if empty
                upvotes: newPost.upvotes,
            })
            .single();

        if (error) {
            console.error("Error creating post:", error);
        } else {
            console.log("Post created:", data);
        }

        window.location = "/";
    };

    return (
        <div>
            <h2>Create Post</h2>
            <hr></hr>
            <form onSubmit={createNewPost}>
                <label htmlFor="title">Title<b style={{color:'red'}}>*</b></label>
                <br></br>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
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
                    value={newPost.content}
                    onChange={handleChange}
                ></textarea>

                <br></br>

                <label htmlFor="image_url">Image URL (optional)</label>
                <br></br>
                <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={newPost.image_url}
                    onChange={handleChange}
                />
                {imageError && <span style={{ color: "red", marginLeft: "10px" }}>{imageError}</span>}

                <br></br>

                <button type="submit" className="submit-button">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;