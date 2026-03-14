import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
                <Brain size={26} />
                <h1 className="text-lg font-bold">國中自然會考心智圖複習</h1>
            </div>
            <nav>
                <ul className="flex space-x-5 text-sm">
                    <li><Link to="/" className="hover:underline">首頁</Link></li>
                    <li><Link to="/mindmap" className="hover:underline">心智圖</Link></li>
                    <li><Link to="/topics" className="hover:underline">主題列表</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;