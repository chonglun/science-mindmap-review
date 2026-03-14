import { useState, useEffect } from 'react';

const useProgress = (totalTopics: number) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const savedProgress = localStorage.getItem('progress');
        if (savedProgress) {
            setProgress(Number(savedProgress));
        }
    }, []);

    const updateProgress = (completedTopics: number) => {
        const newProgress = (completedTopics / totalTopics) * 100;
        setProgress(newProgress);
        localStorage.setItem('progress', newProgress.toString());
    };

    return { progress, updateProgress };
};

export default useProgress;