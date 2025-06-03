import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type {Place} from "@/api/types.ts";

const daneDir = 'dane';

export function loadData(): Place[] {
    const files = fs.readdirSync(daneDir).filter(file => file.endsWith('.yaml'));
    return files.map(file => {
        const filePath = path.join(daneDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(content) as Record<string, any>;

        return {
            id: file.replace('.yaml', ''),
            name: data.nazwa as string,
            address: data.adres as string,
            city: data['miejscowość'] as string,
            description: data.opis as string,
            url: data.www as string,
            glutenFreeOnly: data['tylko-bezglutenowe'] === "tak",
            categories: (data.kategorie as string[]).map(cat => cat.toString()),
            lat: data.lat as number,
            lng: data.lng as number,
        };
    });
}
