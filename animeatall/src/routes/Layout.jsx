import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../App.css';

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="layout-container">
            <nav className="sidebar">
                <div className="header">
                    <h1>anime</h1>
                    <h1>@</h1>
                    <h1>all</h1>
                </div>
                <ul>
                    <li>
                        Search Posts
                    </li>
                    <form className="search-bar" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </form>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/create">Create Post</Link>
                    </li>
                </ul>
            </nav>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;