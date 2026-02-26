import { Mail, List, Search, Code2, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FA_ICON_MAP = {
  "fa-envelope-o": Mail,
  "fa-list":       List,
  "fa-search":     Search,
  "fa-code":       Code2,
  "fa-retweet":    Linkedin,
};

function parseLabel(html) {
  const m = html.match(/>([^<]+)</);
  return m ? m[1] : html.replace(/<[^>]+>/g, "");
}
function parseHref(html) {
  const m = html.match(/href=['"]([^'"]+)['"]/);
  return m ? m[1] : "#";
}

export default function GettingStarted({ quicklinks }) {
  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Getting Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quicklinks.map((item) => {
          const IconComponent = FA_ICON_MAP[item.font_awesome?.trim()] ?? Mail;
          const label         = parseLabel(item.title);
          const href          = parseHref(item.title);
          return (
            <div key={label} className="flex items-start gap-2.5">
              <IconComponent className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <a href={href} className="text-sm font-semibold text-orange-500 leading-tight hover:underline cursor-pointer">
                  {label}
                </a>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.body}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}