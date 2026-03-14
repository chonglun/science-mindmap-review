import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Leaf, Atom, Globe, Map } from 'lucide-react';

const subjects = [
  { id: 'biology', label: '生物', icon: Leaf, color: 'text-green-400', bg: 'bg-green-900/30' },
  { id: 'physics-chemistry', label: '理化', icon: Atom, color: 'text-blue-400', bg: 'bg-blue-900/30' },
  { id: 'earth-science', label: '地球科學', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-900/30' },
];

const Sidebar: React.FC = () => {
    const { subjectId } = useParams<{ subjectId?: string }>();
    return (
        <aside className="w-52 bg-gray-800 text-white shrink-0">
            <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">學科分類</h2>
                <ul className="mt-3 space-y-1">
                    <li>
                        <Link to="/mindmap" className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700 ${!subjectId ? 'bg-gray-700' : ''}`}>
                            <Map size={16} className="text-indigo-400" />
                            <span className="text-sm">全部學科</span>
                        </Link>
                    </li>
                    {subjects.map((s) => (
                        <li key={s.id}>
                            <Link to={`/mindmap/${s.id}`} className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700 ${subjectId === s.id ? s.bg : ''}`}>
                                <s.icon size={16} className={s.color} />
                                <span className="text-sm">{s.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;