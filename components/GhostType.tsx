type GhostTypeProps = {
  lines: string[];
  as?: "h1" | "h2" | "p";
  className?: string;
  size?: string;
};

export default function GhostType({
  lines,
  as: Tag = "h1",
  className = "",
  size = "clamp(5rem, 18vw, 22rem)",
}: GhostTypeProps) {
  return (
    <Tag
      className={`text-ghost mix-blend-difference ${className}`}
      style={{ fontSize: size }}
    >
      {lines.map((line, i) => (
        <span className="display block" key={i}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
