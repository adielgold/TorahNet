import dynamic from "next/dynamic";

const Users = dynamic(() => import("@/components/admin/users/UserManagement"), {
  ssr: false,
});

export default function Page() {
  return <Users />;
}
