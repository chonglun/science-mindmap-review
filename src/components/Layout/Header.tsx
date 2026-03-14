import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between shadow">
            <Link to="/" className="flex items-center gap-2">
                <Brain size={22} />
                <h1 className="text-base md:text-lg font-bold truncate">國中自然會考心智圖</h1>
            </Link>
            <nav>
                <ul className="flex space-x-3 md:space-x-5 text-sm">
                    <li><Link to="/" className="hover:underline">首頁</Link></li>
                    <li><Link to="/mindmap" className="hover:underline">心智圖</Link></li>
                    <li><Link to="/topics" className="hover:underline">主題</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;