export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    image?: string;
};

export type ModelTier = 'pro' | 'flash' | 'flash-lite';
export type ImageSize = '1K' | '2K' | '4K';
