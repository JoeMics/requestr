import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const requests = api.request.getAll.useQuery();
  const [input, setInput] = useState("");
  const { data: sessionData } = useSession();

  const createMutation = api.request.createRequest.useMutation({
    onSuccess: async () => await requests.refetch(),
  });

  const deleteRequest = api.request.deleteRequest.useMutation({
    onSuccess: async () => await requests.refetch(),
  });

  const submitExample = () => {
    createMutation.mutate({ message: input });
    setInput("");
  };

  return (
    <>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Request<span className="text-[hsl(280,100%,70%)]">r</span>
          </h1>

          {sessionData && (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-white">Make a request</h2>

              {createMutation.isLoading && (
                <h2 className="text-white">LOADING...</h2>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                className="appearance-none rounded border-2 border-black bg-transparent text-white"
              />
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={submitExample}
                disabled={createMutation.isLoading}
              >
                Submit Request
              </button>
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            {!requests.data && "Loading tRPC query"}
            {requests?.data?.map((data) => (
              <div className="flex w-full justify-between" key={data.id}>
                {data?.user?.image && (
                  <Image
                    src={data.user.image}
                    alt="profile image"
                    width={30}
                    height={30}
                  />
                )}
                <p className="text-2xl text-white">{data.message} </p>
                <button
                  className="rounded bg-red-400 px-4 py-2"
                  onClick={() => deleteRequest.mutate(data.id)}
                >
                  {deleteRequest.isLoading ? "Deleting..." : "X"}
                </button>
              </div>
            ))}
          </div>
        </div>
    </>
  );
};

export default Home;
