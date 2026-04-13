import { GroupManager } from "../_components/group-manager";

export const metadata = {
  title: "dashboard",
  // other metadata... (excluding viewport)
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function GroupManagerPage() {
  return <GroupManager />
}
