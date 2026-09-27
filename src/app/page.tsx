import { pages } from "@/content/site";
import { Page } from "@/components/layout/Page";
import { Footer } from "@/components/layout/Footer";
import { Reveals } from "@/components/motion/Reveals";
import { Cover } from "@/components/sections/Cover";
import { Gap } from "@/components/sections/Gap";
import { Idea } from "@/components/sections/Idea";
import { SessionFile } from "@/components/sections/SessionFile";
import { Decisions } from "@/components/sections/decisions/Decisions";
import { Files } from "@/components/sections/files/Files";
import { Loop } from "@/components/sections/Loop";
import { Pathway } from "@/components/sections/Pathway";
import { People } from "@/components/sections/People";
import { Partners } from "@/components/sections/partners/Partners";
import { LastPage } from "@/components/sections/LastPage";

/**
 * The issue. Narrative: attention → the gap → the idea → a real session →
 * decisions shown, not told → the work → the loop → the pathway (honest
 * roadmap) → people & credibility → partners → the last page.
 */
export default function Home() {
  const cover = pages[0];
  return (
    <>
      <main id="main">
        <Page id={cover.id} num={cover.num} label={cover.label} theme={cover.theme} bare>
          <Cover />
        </Page>
        <Gap />
        <Idea />
        <SessionFile />
        <Decisions />
        <Files />
        <Loop />
        <Pathway />
        <People />
        <Partners />
        <LastPage />
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
