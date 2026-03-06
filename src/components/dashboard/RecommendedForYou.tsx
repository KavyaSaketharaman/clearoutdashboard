import { Chrome, Plug, Zap, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types";
import { type LucideIcon } from "lucide-react";

interface RecommendedForYouProps {
  recommendations: Recommendation[];
}

const REC_ICON_MAP: Array<{ match: string; Icon: LucideIcon }> = [
  { match: "Chrome",    Icon: Chrome     },
  { match: "WordPress", Icon: Plug       },
  { match: "Sheets",    Icon: Zap        },
  { match: "Auto",      Icon: Zap        },
  { match: "Help",      Icon: Headphones },
];

function parseLabel(html: string): string {
  const m = html.match(/>([^<]+)</);
  return m ? m[1] : html.replace(/<[^>]+>/g, "");
}

function parseHref(html: string): string {
  const m = html.match(/href=['"]([^'"]+)['"]/);
  return m ? m[1] : "#";
}

function getIcon(title: string): LucideIcon {
  return REC_ICON_MAP.find((r) => title.includes(r.match))?.Icon ?? Chrome;
}

export default function RecommendedForYou({ recommendations }: RecommendedForYouProps) {
  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recommended For You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((item) => {
          const label         = parseLabel(item.title);
          const href          = parseHref(item.title);
          const IconComponent = getIcon(label);
          return (
            <div key={label} className="flex items-start gap-2.5">
              <IconComponent className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold hover:underline cursor-pointer">
                  {label}
                </a>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.body}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
