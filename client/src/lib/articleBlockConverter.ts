type BlockType =
  | "text" | "paragraph"
  | "header" | "heading"
  | "image" | "gallery" | "video"
  | "quote" | "list" | "faq" | "accordion"
  | "html" | "update_note" | "ai_prompt" | "creative_team";

export interface EditorBlock {
  type: BlockType;
  [key: string]: any;
}

export interface BlockConversionResult {
  blocks: EditorBlock[];
  stats: {
    convertedHtmlBlocks: number;
    createdHeadings: number;
    createdImages: number;
    createdGalleries: number;
    createdFaqs: number;
    updatedImageDescriptions: number;
  };
}

function sanitizeText(value: string | null | undefined): string {
  return (value || "").replace(/\u00a0/g, " ").trim();
}

function getParagraphText(node: Element): string {
  return sanitizeText(node.textContent);
}

function isHtmlContent(text: string): boolean {
  return /<\s*(p|h2|h3|h4|figure|img|ul|ol|li|blockquote|br)\b/i.test(text);
}

function inferImageCaption(alt: string, articleTitle: string): string {
  if (alt) return alt;
  if (articleTitle) return `Production image from ${articleTitle}`;
  return "Production image";
}

function normalizeBlockShape(block: EditorBlock): EditorBlock {
  if (block.type === "paragraph" || block.type === "text") {
    return {
      ...block,
      text: sanitizeText(block.text || block.content),
    };
  }

  if (block.type === "heading" || block.type === "header") {
    return {
      ...block,
      type: "heading",
      level: Number(block.level || block.metadata?.level || 2),
      text: sanitizeText(block.text || block.content),
    };
  }

  if (block.type === "image") {
    return {
      ...block,
      url: sanitizeText(block.url || block.imageUrl || block.src),
      alt: sanitizeText(block.alt || block.altText),
      caption: sanitizeText(block.caption || block.description || block.content),
    };
  }

  if (block.type === "gallery") {
    const sourceImages = Array.isArray(block.images)
      ? block.images
      : Array.isArray(block.metadata?.images)
        ? block.metadata.images
        : [];

    return {
      ...block,
      images: sourceImages.map((img: any) => ({
        url: sanitizeText(img?.url || img?.src || img?.imageUrl),
        alt: sanitizeText(img?.alt || img?.altText),
        caption: sanitizeText(img?.caption || img?.description),
      })),
    };
  }

  if (block.type === "faq" || block.type === "accordion") {
    const sourceItems = Array.isArray(block.items) ? block.items : [];
    return {
      ...block,
      type: "faq",
      items: sourceItems.map((item: any) => ({
        question: sanitizeText(item?.question || item?.q),
        answer: sanitizeText(item?.answer || item?.a || item?.content),
      })),
    };
  }

  return block;
}

function mapImageElement(img: HTMLImageElement, articleTitle: string) {
  const url = sanitizeText(img.getAttribute("src"));
  if (!url) return null;
  const alt = sanitizeText(img.getAttribute("alt"));
  const caption = inferImageCaption(alt, articleTitle);
  return {
    url,
    alt: alt || caption,
    caption,
  };
}

function htmlToBlocks(html: string, articleTitle: string): Omit<BlockConversionResult, "stats"> & {
  counts: Pick<BlockConversionResult["stats"], "createdHeadings" | "createdImages" | "createdGalleries">;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  const nextBlocks: EditorBlock[] = [];
  let createdHeadings = 0;
  let createdImages = 0;
  let createdGalleries = 0;

  if (!root) {
    return { blocks: [{ type: "paragraph", text: html }], counts: { createdHeadings, createdImages, createdGalleries } };
  }

  const nodes = Array.from(root.childNodes);
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = sanitizeText(node.textContent);
      if (text) nextBlocks.push({ type: "paragraph", text });
      continue;
    }

    if (!(node instanceof Element)) continue;
    const tag = node.tagName.toLowerCase();

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const text = sanitizeText(node.textContent);
      if (text) {
        nextBlocks.push({ type: "heading", level: Number(tag[1]), text });
        createdHeadings += 1;
      }
      continue;
    }

    if (tag === "p") {
      const text = getParagraphText(node);
      if (text) nextBlocks.push({ type: "paragraph", text });
      continue;
    }

    if (tag === "figure") {
      const images = Array.from(node.querySelectorAll("img"))
        .map(img => mapImageElement(img, articleTitle))
        .filter(Boolean) as Array<{ url: string; alt: string; caption: string }>;
      const figcaption = sanitizeText(node.querySelector("figcaption")?.textContent);

      if (images.length === 1) {
        const image = images[0];
        nextBlocks.push({
          type: "image",
          url: image.url,
          alt: image.alt,
          caption: figcaption || image.caption,
        });
        createdImages += 1;
      } else if (images.length > 1) {
        nextBlocks.push({
          type: "gallery",
          images: images.map(image => ({
            url: image.url,
            alt: image.alt,
            caption: image.caption,
          })),
        });
        createdGalleries += 1;
      }
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const items = Array.from(node.querySelectorAll("li"))
        .map(li => sanitizeText(li.textContent))
        .filter(Boolean);
      if (items.length > 0) {
        nextBlocks.push({
          type: "list",
          items,
          listType: tag === "ol" ? "numbered" : "bullet",
          ordered: tag === "ol",
        });
      }
      continue;
    }

    if (tag === "blockquote") {
      const text = sanitizeText(node.textContent);
      if (text) nextBlocks.push({ type: "quote", text });
      continue;
    }

    const fallbackText = sanitizeText(node.textContent);
    if (fallbackText) nextBlocks.push({ type: "paragraph", text: fallbackText });
  }

  return {
    blocks: nextBlocks,
    counts: { createdHeadings, createdImages, createdGalleries },
  };
}

function convertFaqSectionsFromHeadings(blocks: EditorBlock[]) {
  const result: EditorBlock[] = [];
  let createdFaqs = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const headingText = sanitizeText(block.text || block.content).toLowerCase();

    if (block.type === "heading" && Number(block.level || 2) === 2 && headingText.includes("faq")) {
      const faqItems: Array<{ question: string; answer: string }> = [];
      let cursor = i + 1;

      while (cursor < blocks.length) {
        const current = blocks[cursor];

        if (current.type === "heading" && Number(current.level || 2) === 2) {
          break;
        }

        if (current.type === "heading" && Number(current.level || 2) >= 3) {
          const question = sanitizeText(current.text || current.content).replace(/\+$/, "");
          cursor += 1;

          const answerParts: string[] = [];
          while (cursor < blocks.length) {
            const candidate = blocks[cursor];
            if (candidate.type === "heading") break;
            if (candidate.type === "paragraph" || candidate.type === "text") {
              const answerText = sanitizeText(candidate.text || candidate.content);
              if (answerText) answerParts.push(answerText);
            }
            cursor += 1;
          }

          if (question && answerParts.length > 0) {
            faqItems.push({
              question,
              answer: answerParts.join("\n\n"),
            });
          }
          continue;
        }

        cursor += 1;
      }

      if (faqItems.length > 0) {
        result.push({ type: "faq", items: faqItems });
        createdFaqs += 1;
        i = cursor - 1;
        continue;
      }
    }

    result.push(block);
  }

  return { blocks: result, createdFaqs };
}

function convertQuestionAnswerParagraphs(blocks: EditorBlock[]) {
  const result: EditorBlock[] = [];
  let createdFaqs = 0;

  for (let i = 0; i < blocks.length; i++) {
    const current = blocks[i];
    const currentText = sanitizeText(current.text || current.content);
    const next = blocks[i + 1];
    const nextText = sanitizeText(next?.text || next?.content);

    if (/^q:\s+/i.test(currentText) && /^a:\s+/i.test(nextText)) {
      const items: Array<{ question: string; answer: string }> = [];
      let cursor = i;

      while (cursor < blocks.length) {
        const qBlock = blocks[cursor];
        const aBlock = blocks[cursor + 1];
        const qText = sanitizeText(qBlock?.text || qBlock?.content);
        const aText = sanitizeText(aBlock?.text || aBlock?.content);

        if (!/^q:\s+/i.test(qText) || !/^a:\s+/i.test(aText)) break;
        items.push({
          question: qText.replace(/^q:\s+/i, ""),
          answer: aText.replace(/^a:\s+/i, ""),
        });
        cursor += 2;
      }

      if (items.length > 0) {
        result.push({ type: "faq", items });
        createdFaqs += 1;
        i = cursor - 1;
        continue;
      }
    }

    result.push(current);
  }

  return { blocks: result, createdFaqs };
}

function normalizeImageDescriptions(blocks: EditorBlock[], articleTitle: string) {
  let updatedImageDescriptions = 0;

  const normalized = blocks.map(block => {
    if (block.type === "image") {
      const alt = sanitizeText(block.alt);
      const caption = sanitizeText(block.caption);
      const nextCaption = caption || inferImageCaption(alt, articleTitle);
      const nextAlt = alt || nextCaption;
      if (nextAlt !== alt || nextCaption !== caption) {
        updatedImageDescriptions += 1;
      }
      return { ...block, alt: nextAlt, caption: nextCaption };
    }

    if (block.type === "gallery" && Array.isArray(block.images)) {
      const nextImages = block.images.map((img: any) => {
        const alt = sanitizeText(img?.alt);
        const caption = sanitizeText(img?.caption);
        const nextCaption = caption || inferImageCaption(alt, articleTitle);
        const nextAlt = alt || nextCaption;
        if (nextAlt !== alt || nextCaption !== caption) {
          updatedImageDescriptions += 1;
        }
        return { ...img, alt: nextAlt, caption: nextCaption };
      });
      return { ...block, images: nextImages };
    }

    return block;
  });

  return { blocks: normalized, updatedImageDescriptions };
}

export function convertLegacyArticleBlocks(
  blocks: EditorBlock[],
  options: { articleTitle?: string } = {}
): BlockConversionResult {
  const articleTitle = options.articleTitle || "";
  const normalizedSource = blocks.map(normalizeBlockShape);
  const converted: EditorBlock[] = [];
  let convertedHtmlBlocks = 0;
  let createdHeadings = 0;
  let createdImages = 0;
  let createdGalleries = 0;

  for (const block of normalizedSource) {
    if ((block.type === "paragraph" || block.type === "text") && typeof (block.text || block.content) === "string") {
      const rawText = String(block.text || block.content);
      if (isHtmlContent(rawText)) {
        const parsed = htmlToBlocks(rawText, articleTitle);
        converted.push(...parsed.blocks);
        convertedHtmlBlocks += 1;
        createdHeadings += parsed.counts.createdHeadings;
        createdImages += parsed.counts.createdImages;
        createdGalleries += parsed.counts.createdGalleries;
        continue;
      }
    }
    converted.push(block);
  }

  const headingFaqConverted = convertFaqSectionsFromHeadings(converted);
  const qaFaqConverted = convertQuestionAnswerParagraphs(headingFaqConverted.blocks);
  const normalized = normalizeImageDescriptions(qaFaqConverted.blocks, articleTitle);

  return {
    blocks: normalized.blocks,
    stats: {
      convertedHtmlBlocks,
      createdHeadings,
      createdImages,
      createdGalleries,
      createdFaqs: headingFaqConverted.createdFaqs + qaFaqConverted.createdFaqs,
      updatedImageDescriptions: normalized.updatedImageDescriptions,
    },
  };
}
