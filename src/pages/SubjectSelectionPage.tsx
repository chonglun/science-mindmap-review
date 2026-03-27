import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, BookOpen, Languages, Calculator, Globe, type LucideIcon } from 'lucide-react';
import { examSubjectRegistry } from '../hooks/useSubjectData';

interface ExamSubject {
  id: string;
  label: string;
  color: string;
  icon: LucideIcon;
  description: string;
  available: boolean;
}

const examSubjects: ExamSubject[] = [
  { id: 'science', label: '自然科', color: '#22c55e', icon: Atom, description: '生物、理化、地球科學', available: 'science' in examSubjectRegistry },
  { id: 'social', label: '社會', color: '#f97316', icon: Globe, description: '歷史、地理、公民', available: 'social' in examSubjectRegistry },
  { id: 'chinese', label: '國文', color: '#ef4444', icon: BookOpen, description: '閱讀理解、語文常識、寫作', available: 'chinese' in examSubjectRegistry },
  { id: 'english', label: '英文', color: '#8b5cf6', icon: Languages, description: '文法、閱讀、字彙', available: 'english' in examSubjectRegistry },
  { id: 'math', label: '數學', color: '#3b82f6', icon: Calculator, description: '代數、幾何、統計', available: 'math' in examSubjectRegistry },
];

const SubjectSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">國中會考心智圖複習</h1>
      <p className="text-gray-600 mb-8">選擇一個科目，開始複習吧！</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {examSubjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <button
              key={subject.id}
              onClick={() => subject.available && navigate(`/subject/${subject.id}`)}
              disabled={!subject.available}
              className={`relative text-left rounded-xl border-2 p-5 transition-all ${
                subject.available
                  ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 border-gray-200'
                  : 'cursor-not-allowed opacity-60 border-gray-100'
              }`}
              style={{ borderColor: subject.available ? subject.color + '40' : undefined }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: subject.color + '20' }}>
                  <Icon size={24} style={{ color: subject.color }} />
                </div>
                <h2 className="text-lg font-bold">{subject.label}</h2>
              </div>
              <p className="text-sm text-gray-500">{subject.description}</p>
              {!subject.available && (
                <span className="absolute top-3 right-3 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                  即將推出
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelectionPage;
