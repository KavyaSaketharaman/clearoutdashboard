import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserInfoCard({ welcome }) {
  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardContent className="pt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome !</p>
          <p className="text-lg font-bold">{welcome?.name ?? "—"}</p>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Plan</p>
            <p className="font-semibold">{welcome?.subscription?.[0]?.product_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining Credits</p>
            <p className="font-bold text-base">
              {welcome?.org_details?.credits?.available != null
                ? welcome.org_details.credits.available.toLocaleString()
                : "—"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Organization</p>
              <p className="font-semibold">{welcome?.org_details?.name ?? "—"}</p>
            </div>
            <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">Switch</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Team Members</p>
              <p className="font-semibold">
                {welcome?.org_details?.usedMemberSeat ?? "—"} / {welcome?.org_details?.totalMemberSeat ?? "—"}
              </p>
            </div>
            <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">Manage</Button>
          </div>
          <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">
            Looking for more seats?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}