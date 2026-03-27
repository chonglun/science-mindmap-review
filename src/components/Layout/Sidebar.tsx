import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Atom, Globe, Map, ArrowLeft, BookOpen, MapPin, Scale, type LucideIcon } from 'lucide-react';
import { useExamSubjectId } from '../../hooks/useExamSubjectId';

const subjectsByExam: Record<string, { id: string; label: string; icon: LucideIcon; color: string; bg: string }[]> = {
  science: [
    { id: 'biology', label: '生物', icon: Leaf, color: 'text-green-400', bg: 'bg-green-900/30' },
    { id: 'physics-chemistry', label: '理化', icon: Atom, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    { id: 'earth-science', label: '地球科學', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-900/30' },
  ],
  social: [
    { id: 'history', label: '歷史', icon: BookOpen, color: 'text-red-400', bg: 'bg-red-900/30' },
    { id: 'geography', label: '地理', icon: MapPin, color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
    { id: 'civics', label: '公民與社會', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-900/30' },
  ],
};

const Sidebar: React.FC = () => {
    const { examSubjectId, activeSubjectId } = useExamSubjectId();

    // Don't render sidebar on subject selection page
    if (!examSubjectId) return null;

    const subjects = subjectsByExam[examSubjectId] ?? [];

    return (
        <>
            {/* Desktop: vertical sidebar */}
            <aside className="hidden md:block w-52 bg-gray-800 text-white shrink-0 h-full">
                <div className="p-4">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4">
                        <ArrowLeft size={14} />
                        <span>回科目選擇</span>
                    </Link>
                    {subjects.length > 0 ? (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">學科分類</h2>
                            <ul className="mt-3 space-y-1">
                                <li>
                                    <Link to={`/mindmap/${examSubjectId}`} className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700 ${!activeSubjectId ? 'bg-gray-700' : ''}`}>
                                        <Map size={16} className="text-indigo-400" />
                                        <span className="text-sm">全部學科</span>
                                    </Link>
                                </li>
                                {subjects.map((s) => (
                                    <li key={s.id}>
                                        <Link to={`/mindmap/${examSubjectId}/${s.id}`} className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700 ${activeSubjectId === s.id ? s.bg : ''}`}>
                                            <s.icon size={16} className={s.color} />
                                            <span className="text-sm">{s.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 mt-3">即將推出，敬請期待！</p>
                    )}
                </div>
            </aside>
            {/* Mobile: bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
                <ul className="flex justify-around py-1.5">
                    <li>
                        <Link to={`/mindmap/${examSubjectId}`} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${!activeSubjectId ? 'text-indigo-400' : 'text-gray-400'}`}>
                            <Map size={18} />
                            <span className="text-[10px]">全部</span>
                        </Link>
                    </li>
                    {subjects.map((s) => (
                        <li key={s.id}>
                            <Link to={`/mindmap/${examSubjectId}/${s.id}`} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${activeSubjectId === s.id ? s.color : 'text-gray-400'}`}>
                                <s.icon size={18} />
                                <span className="text-[10px]">{s.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default Sidebar;