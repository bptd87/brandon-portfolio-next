const sitemapStylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap | Brandon PT Davis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root {
            color: #1d1d1f;
            background: #f7f6f2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          body {
            margin: 0;
            background: #f7f6f2;
          }

          main {
            margin: 0 auto;
            max-width: 1120px;
            padding: clamp(32px, 5vw, 72px) clamp(20px, 4vw, 48px);
          }

          h1 {
            margin: 0;
            font-size: clamp(42px, 7vw, 84px);
            line-height: 0.95;
            letter-spacing: -0.04em;
          }

          p {
            margin: 18px 0 40px;
            max-width: 640px;
            color: rgba(29, 29, 31, 0.64);
            font-size: 18px;
            line-height: 1.5;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            border-top: 1px solid rgba(0, 0, 0, 0.12);
          }

          th {
            color: rgba(29, 29, 31, 0.46);
            font-size: 11px;
            letter-spacing: 0.18em;
            text-align: left;
            text-transform: uppercase;
          }

          th,
          td {
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding: 16px 12px;
            vertical-align: top;
          }

          td {
            color: rgba(29, 29, 31, 0.7);
            font-size: 14px;
            line-height: 1.45;
          }

          a {
            color: #1d1d1f;
            overflow-wrap: anywhere;
            text-decoration: none;
          }

          a:hover {
            color: #7b4ce0;
          }

          @media (max-width: 760px) {
            th:nth-child(2),
            th:nth-child(3),
            td:nth-child(2),
            td:nth-child(3) {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p>
            This XML sitemap is formatted for browsers and remains machine-readable for search engines.
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a>
                      <xsl:attribute name="href">
                        <xsl:value-of select="sitemap:loc" />
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:loc" />
                    </a>
                  </td>
                  <td><xsl:value-of select="sitemap:lastmod" /></td>
                  <td><xsl:value-of select="sitemap:changefreq" /></td>
                  <td><xsl:value-of select="sitemap:priority" /></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export function GET() {
  return new Response(sitemapStylesheet, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
