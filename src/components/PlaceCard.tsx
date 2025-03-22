import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface PlaceCardProps {
    name: string;
    description: string;
    city: string;
    address: string;
    url?: string;
    glutenFreeOnly: boolean;
    categories?: string[];
    id: string;
}

const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
};

export function PlaceCard({
    name,
    description,
    city,
    address,
    url,
    glutenFreeOnly,
    categories = []
}: PlaceCardProps) {
    // Format description paragraphs
    const opisParagraphs = description.trim().length > 300
        ? [`${description.trim().slice(0, 300)}...`]
        : description.trim().split('\n\n');

    const formattedWww = url ? formatUrl(url) : '';

    return (
        <Card>
            <CardHeader className="flex flex-col gap-2">
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map(kategoria => (
                            <Badge key={kategoria} variant="outline">{kategoria}</Badge>
                        ))}
                    </div>
                )}
                <CardTitle className="font-bold text-xl mt-2">
                    {name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-muted-foreground">
                        {opisParagraphs.map((paragraph, index) => (
                            <p key={index} className="mb-4 last:mb-0">{paragraph.trim()}</p>
                        ))}
                    </div>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Miejscowość:</span> {city}</p>
                        <p><span className="font-semibold">Adres:</span> {address}</p>
                        {url && (
                            <p>
                                <span className="font-semibold">WWW:</span>
                                <a href={formattedWww} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">{url}</a>
                            </p>
                        )}
                        <p>
                            <span className="font-semibold">Tylko bezglutenowe:</span>
                            <span className="ml-1">{glutenFreeOnly ? "tak" : "nie"}</span>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
