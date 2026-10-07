import * as S from "@/sections/home";
import { getContent } from "@/lib/site-content";

export default async function Home() {
  const { settings, featuredMedia } = await getContent();
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
      <S.RealProduct media={featuredMedia} />
      <S.BuiltDifferent />
      <S.Technology />
      <S.Gen1 stage={stage} />
      <S.FinalCta stage={stage} />
    </>
  );
}
