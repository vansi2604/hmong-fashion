import { redirect } from "next/navigation";

export default function AdminTailorsRedirect() {
  redirect("/dashboard_control/tailors");
}
