import React from 'react';

interface TopicCardProps {
    title: string;
    description: string;
    onClick?: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ title, description, onClick }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default TopicCard;