import React from 'react';
import TopicCard from '../components/UI/TopicCard';
import { useAllSubjects } from '../hooks/useSubjectData';

const TopicListPage: React.FC = () => {
    const { subjects, loading } = useAllSubjects();

    if (loading) return <div className="p-4"><p className="text-gray-400">載入中...</p></div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">所有主題</h1>
            <div className="space-y-6">
                {subjects.map((subject: any) => (
                    <div key={subject.id}>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: subject.color }}>
                            {subject.label}
                        </h2>
                        {subject.units ? (
                            <div className="space-y-4">
                                {subject.units.map((unit: any) => (
                                    <div key={unit.id}>
                                        <h3 className="text-base font-medium text-gray-700 mb-2">
                                            {unit.name}
                                            <span className="text-xs text-gray-400 ml-2">{unit.stage}</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {unit.topics.map((topic: any) => (
                                                <TopicCard
                                                    key={topic.id}
                                                    title={topic.name}
                                                    description={topic.hook.slice(0, 60) + '...'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subject.topics?.map((topic: any) => (
                                    <TopicCard
                                        key={topic.id}
                                        title={topic.name}
                                        description={topic.hook.slice(0, 60) + '...'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopicListPage;