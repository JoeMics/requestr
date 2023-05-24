import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const Groups: NextPage = () => {
  const { data: sessionData } = useSession();
  return <div>{sessionData?.user?.name || ""}</div>;
};

export default Groups;
