import { useState } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DidYouKnow({ tips }) {
  const [index, setIndex] = useState(0);
  const tip = tips?.[index];
  const total = tips?.length ?? 0;

  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Did You Know?</CardTitle>
          {total > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="p-0.5 rounded hover:bg-amber-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-orange-500" />
              </button>
              <span className="text-xs text-muted-foreground">{index + 1}/{total}</span>
              <button
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                disabled={index === total - 1}
                className="p-0.5 rounded hover:bg-amber-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-orange-500" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tip ? (
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground leading-snug">
                {tip.title}
              </p>
              <div
                className="text-xs text-muted-foreground leading-relaxed line-clamp-4 prose prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: tip.body }}
              />
              {tip.url && (
                <a
                  href={tip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-500 hover:underline font-medium inline-block mt-1"
                >
                  Learn More →
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing to show</p>
        )}
      </CardContent>
    </Card>
  );
}