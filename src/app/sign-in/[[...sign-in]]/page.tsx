import CenterWrapper from "@/components/my-components/CenterWrapper";
import GradientWrapper from "@/components/my-components/GradientWrapper";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <GradientWrapper>
      <CenterWrapper>
        <SignIn />
      </CenterWrapper>
    </GradientWrapper>
  );
}
