import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs/app-beta";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import CenterWrapper from "@/components/my-components/CenterWrapper";
import GradientWrapper from "@/components/my-components/GradientWrapper";
import FileUpload from "@/components/my-components/FileUpload";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <GradientWrapper>
      <CenterWrapper>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && <Button>Go to Chats</Button>}
          </div>
          <p className="max-w-xl mt-2 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>Login to get started! <LogInIcon className="w-4 h-4 ml-2"/></Button>
              </Link>
            )}
          </div>
        </div>
      </CenterWrapper>
    </GradientWrapper>
  );
}
