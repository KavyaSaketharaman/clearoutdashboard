import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DidYouKnow({ tips }) {
  const tip = tips?.[0];

  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Did You Know?</CardTitle>
      </CardHeader>
      <CardContent>
        {tip ? (
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                {tip.title}
              </p>
              <a
                href={tip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-500 hover:underline font-medium"
              >
                Learn More →
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing to show</p>
        )}
      </CardContent>
    </Card>
  );
}