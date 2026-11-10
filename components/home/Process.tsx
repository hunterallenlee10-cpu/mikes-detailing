import { processSteps } from "@/content/site";
import { Photo } from "../Photo";
import { Container, SectionHead } from "../ui";
import { ProcessTimeline } from "./ProcessTimeline";

export function Process({ title }: { title?: string }) {
  const visuals = processSteps.map((s, i) =>
    s.photo ? (
      <Photo key={i} slug={s.photo} alt={s.alt ?? s.title} sizes="(min-width: 768px) 45vw, 92vw" />
    ) : (
      <div key={i} className="h-full w-full bg-graphite" />
    ),
  );
  return (
    <section id="process" className="relative py-24 sm:py-32" aria-labelledby="process-title">
      <Container>
        <SectionHead
          eyebrow="The process"
          title={
            <span id="process-title">
              <span className="chrome">{title ?? "Six steps."}</span> <span className="text-red">No shortcuts.</span>
            </span>
          }
          lead="This is how a Mike's detail goes from dirty to dripping — and why it lasts."
        />
        <div className="mt-14">
          <ProcessTimeline visuals={visuals} />
        </div>
      </Container>
    </section>
  );
}
