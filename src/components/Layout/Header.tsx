import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useExamSubjectId } from '../../hooks/useExamSubjectId';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
    const { examSubjectId } = useExamSubjectId();

    return (
        <header className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between shadow">
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <Brain size={22} />
                <h1 className="text-base md:text-lg font-bold truncate">國中會考心智圖複習</h1>
            </Link>
            <div className="flex items-center gap-3 md:gap-5">
                <SearchBar />
                <nav>
                    <ul className="flex space-x-3 md:space-x-5 text-sm">
                        <li><Link to="/" className="hover:underline">首頁</Link></li>
                        {examSubjectId && (
                            <>
                                <li><Link to={`/mindmap/${examSubjectId}`} className="hover:underline">心智圖</Link></li>
                                <li><Link to={`/topics/${examSubjectId}`} className="hover:underline">主題</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;