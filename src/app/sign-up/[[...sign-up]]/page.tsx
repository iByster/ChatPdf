import CenterWrapper from "@/components/my-components/CenterWrapper";
import GradientWrapper from "@/components/my-components/GradientWrapper";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <GradientWrapper>
      <CenterWrapper>
        <SignUp />
      </CenterWrapper>
    </GradientWrapper>
  );
}
