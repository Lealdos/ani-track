export type Anime = {
    mal_id: number;
    title: string;
    type: string;
    episodes: number;
    status: string;
    score: number;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    synopsis?: string;
    genres?: { mal_id: number; name: string }[];
    aired?: {
        from: string;
        to: string;
    };
    studios?: { mal_id: number; name: string }[];
    rating?: string;
    duration?: string;
    season?: string;
    year?: number;
    streaming?: streaming[];
};

export type streaming = {
    name: string;
    url: string;
};
