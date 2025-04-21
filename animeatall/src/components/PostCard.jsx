import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {

    return (
        <div key={post.id} className="post">
            <div className="post-header">
                <h3>{post.title}</h3>
                <p>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
            </div>
            <p>{post.upvotes} {post.upvotes === 1 ? 'upvote' : 'upvotes'}</p>
        </div>
    )
}

export default PostCard;