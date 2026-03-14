export const transformMindMapData = (data: any) => {
    // Transform the mind map data into a format suitable for rendering
    return data.map((topic: any) => ({
        id: topic.id,
        label: topic.name,
        children: topic.subtopics ? transformMindMapData(topic.subtopics) : [],
        concepts: topic.concepts || [],
        questions: topic.questions || [],
    }));
};

export const extractCoreConcepts = (data: any) => {
    // Extract core concepts from the mind map data
    return data.flatMap((topic: any) => topic.concepts || []);
};

export const extractPastQuestions = (data: any) => {
    // Extract past exam questions from the mind map data
    return data.flatMap((topic: any) => topic.questions || []);
};