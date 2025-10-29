export interface User {
    logo: unknown;
    role: "business" | "admin";
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};


export interface image {
    id: number;
    url: string;
    is_processed: boolean;
}

export interface product {
    id: number;
    name: string;
    price: string;
    description: string;
    rating: number;
    images: image[];
    stock: string;
    slug?: string;
}

export interface vendor {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    coordinates: string;
    short_note: string;
    slug: string;
    logo_url?: string;
}
