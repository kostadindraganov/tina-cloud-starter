import dynamic from 'next/dynamic';

const MermaidElement = dynamic(() => import('../mermaid-renderer'), {
  ssr: false,
  loading: () => <div>Loading diagram...</div>,
});

interface MermaidProps {
  value?: string;
}

export function mermaid(props: MermaidProps) {
  if (!props?.value) return <></>;
  return <MermaidElement value={props.value} />;
}
