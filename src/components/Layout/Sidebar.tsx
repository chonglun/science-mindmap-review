import React from 'react';
import { Leaf, Atom, Globe } from 'lucide-react';

const subjects = [
  { label: '生物', icon: Leaf, color: 'text-green-400' },
  { label: '理化', icon: Atom, color: 'text-blue-400' },
  { label: '地球科學', icon: Globe, color: 'text-amber-400' },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-52 bg-gray-800 text-white shrink-0">
            <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">學科分類</h2>
                <ul className="mt-3 space-y-1">
                    {subjects.map((s) => (
                        <li key={s.label} className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700 cursor-pointer">
                            <s.icon size={16} className={s.color} />
                            <span className="text-sm">{s.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;