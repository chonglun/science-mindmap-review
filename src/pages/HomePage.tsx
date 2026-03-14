import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/UI/TopicCard';
import { useAllSubjects } from '../hooks/useSubjectData';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { subjects, loading } = useAllSubjects();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">國中自然科會考心智圖複習</h1>
            <p className="text-gray-600 mb-6">選擇一個學科，開始用心智圖複習吧！</p>
            {loading ? (
                <p className="text-gray-400">載入中...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject: any) => {
                        const count = subject.units
                            ? subject.units.reduce((s: number, u: any) => s + u.topics.length, 0)
                            : subject.topics?.length ?? 0;
                        return (
                            <TopicCard
                                key={subject.id}
                                title={subject.label}
                                description={`包含 ${count} 個主題`}
                                onClick={() => navigate(`/mindmap/${subject.id}`)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HomePage;