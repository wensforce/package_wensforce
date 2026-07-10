/**
 * Renders a JSON-LD <script> block.
 * Usage: <JsonLd data={{ "@context": "...", ... }} />
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
