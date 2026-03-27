import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Atom, Globe, ArrowLeft, BookOpen, MapPin, Scale, PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react';
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
    const [collapsed, setCollapsed] = useState(false);

    // Don't render sidebar on subject selection page
    if (!examSubjectId) return null;

    const subjects = subjectsByExam[examSubjectId] ?? [];

    return (
        <>
            {/* Desktop: collapsible vertical sidebar */}
            <aside className={`hidden md:flex flex-col bg-gray-800 text-white shrink-0 transition-all duration-300 ${collapsed ? 'w-14' : 'w-52'}`}>
                <div className={`flex-1 ${collapsed ? 'px-2 py-4' : 'p-4'} overflow-hidden`}>
                    {collapsed ? (
                        <Link to="/" className="flex justify-center text-gray-400 hover:text-white mb-4" title="回科目選擇">
                            <ArrowLeft size={16} />
                        </Link>
                    ) : (
                        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4">
                            <ArrowLeft size={14} />
                            <span>回科目選擇</span>
                        </Link>
                    )}
                    {subjects.length > 0 ? (
                        <>
                            {!collapsed && <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">學科分類</h2>}
                            <ul className={`${collapsed ? 'mt-1' : 'mt-3'} space-y-1`}>
                                {subjects.map((s) => (
                                    <li key={s.id}>
                                        <Link
                                            to={`/mindmap/${examSubjectId}/${s.id}`}
                                            className={`flex items-center ${collapsed ? 'justify-center py-2' : 'gap-2 py-2 px-2'} rounded hover:bg-gray-700 ${activeSubjectId === s.id ? s.bg : ''}`}
                                            title={collapsed ? s.label : undefined}
                                        >
                                            <s.icon size={16} className={`${s.color} shrink-0`} />
                                            {!collapsed && <span className="text-sm">{s.label}</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        !collapsed && <p className="text-sm text-gray-500 mt-3">即將推出，敬請期待！</p>
                    )}
                </div>
                <button
                    onClick={() => setCollapsed((v) => !v)}
                    className="flex items-center justify-center py-3 border-t border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label={collapsed ? '展開選單' : '收合選單'}
                    title={collapsed ? '展開選單' : '收合選單'}
                >
                    {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>
            </aside>
            {/* Mobile: bottom tab bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
                <ul className="flex justify-around py-1.5">
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