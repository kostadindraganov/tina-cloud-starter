import { useIntersectionObserver } from "usehooks-ts";
import mermaid from "mermaid";

interface MermaidElementProps {
  value: string;
}

export default function MermaidElement({ value }: MermaidElementProps) {
  const { ref } = useIntersectionObserver({
    threshold: 0.01,
    freezeOnceVisible: true,
    onChange(isIntersecting, entry) {
      if (isIntersecting) {
        mermaid.initialize({ startOnLoad: false });
        mermaid.run({ nodes: [entry.target as HTMLElement] });
      }
    },
  });

  return (
    <div contentEditable={false}>
      <pre ref={ref} suppressHydrationWarning>
        {value}
      </pre>
    </div>
  );
}
