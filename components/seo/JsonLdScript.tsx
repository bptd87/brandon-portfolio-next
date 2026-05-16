type JsonLdScriptProps = {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLdScript({ id, data }: JsonLdScriptProps) {
  const entries = Array.isArray(data) ? data : [data];

  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={`${id}-${index}`}
          id={entries.length > 1 ? `${id}-${index + 1}` : id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entry).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
