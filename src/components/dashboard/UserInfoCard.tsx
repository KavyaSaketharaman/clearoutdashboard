import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WelcomeData } from "@/types";

interface UserInfoCardProps {
  welcome: WelcomeData | undefined;
}

export default function UserInfoCard({ welcome }: UserInfoCardProps) {
  const available = welcome?.credits?.available;
  const orgName   = welcome?.org_details?.name ?? welcome?.address?.company_name ?? "clearout";
  const planName  = welcome?.subscription?.[0]?.product_name ?? welcome?.recur?.name ?? "Freemium 100 credits";
  const usedSeat  = welcome?.org_details?.usedMemberSeat ?? null;
  const totalSeat = welcome?.org_details?.totalMemberSeat ?? null;

  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardContent className="pt-5 px-5 pb-4 space-y-0 divide-y divide-gray-100">

        <div className="pb-4">
          <p className="text-sm text-gray-500">Welcome !</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{welcome?.name ?? "—"}</p>
        </div>

        <div className="py-4">
          <p className="text-sm text-gray-500">Plan</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{planName}</p>
        </div>

        <div className="py-4">
          <p className="text-sm text-gray-500">Remaining Credits</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {available != null ? available.toLocaleString() : "—"}
          </p>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Organization</p>
            <Button variant="link" className="text-orange-500 p-0 h-auto text-sm font-semibold">Switch</Button>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{orgName}</p>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Team Members</p>
            <Button variant="link" className="text-orange-500 p-0 h-auto text-sm font-semibold">Manage</Button>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {usedSeat != null && totalSeat != null ? `${usedSeat} / ${totalSeat}` : "— / —"}
          </p>
        </div>

        <div className="pt-3">
          <Button variant="link" className="text-orange-500 p-0 h-auto text-sm font-semibold">
            Looking for more seats?
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
