import * as S from "@/sections/home";
import { getRelease } from "@/lib/release";

export default async function Home() {
  const { content, screenshots } = await getRelease();
  const { settings } = content;
  const stage = settings.releaseStage;
  return (
    <>
      <S.Hero stage={stage} />
      <S.Problem />
      <S.Introducing />
      <S.OneMind />
      <S.AgentSystem />
      <S.Action />
      <S.ComputerControl />
      <S.Memory />
      <S.Voice />
      <S.Capabilities />
      <S.ParallelWork />
      <S.Ecosystem />
      <S.RealProduct media={screenshots} />
      <S.BuiltDifferent />
      <S.Technology />
      <S.Gen1 stage={stage} />
      <S.FinalCta stage={stage} />
    </>
  );
}
