import React from "react";
import ShowDataKPIC from "./ShowDataKPIC";
import { fetchDataKPIC } from "@/actions/user/dashboard/kpicard/Actions";
import { getUserSubscriptionsActiveAction } from "@/actions/admin/plans/Actions";
import { getCurrentUser } from "@/lib/auth";

export default async function FetchDataKPIC() {
  const user = await getCurrentUser();

  // اجرای موازی هر دو کوئری با استفاده از user.userId
  const [kpiRes, subRes] = await Promise.all([
    user?.userId ? fetchDataKPIC(user.userId) : Promise.resolve(null),
    user?.userId
      ? getUserSubscriptionsActiveAction(user.userId)
      : Promise.resolve({ success: false, data: [] }),
  ]);

  const activeSub =
    subRes.success && subRes.data && subRes.data.length > 0
      ? subRes.data[0]
      : null;

  return (
    <div>
      <ShowDataKPIC
        kpiData={kpiRes}
        activeSub={activeSub}
        isLoggedIn={Boolean(user)}
      />
    </div>
  );
}