import { useEffect, useState } from 'react';

interface MindMapData {
  topics: Array<{
    name: string;
    lifeAssociations: string[];
    coreConcepts: string[];
    pastExamQuestions: string[];
  }>;
}

const useMindMapData = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMindMapData = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'data/mindmaps.json');
        if (!response.ok) {
          throw new Error('Failed to fetch mind map data');
        }
        const data: MindMapData = await response.json();
        setMindMapData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMindMapData();
  }, []);

  return { mindMapData, loading, error };
};

export default useMindMapData;