export interface Place {
    id: string,
    name: string,
    address: string,
    city: string,
    description: string,
    categories: string[],
    glutenFreeOnly: boolean,
    url?: string,
    lat?: number,
    lng?: number,
    image?: string,
}
