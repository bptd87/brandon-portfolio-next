import 'dotenv/config';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createArticle, updateArticle, getArticleBySlug, getArticleById } from '../server/db';


// ==========================================
// 1. LOAD HTML CONTENT FROM FILE
// ==========================================
const rawHtml = readFileSync(join(process.cwd(), 'scripts', 'article_content_60146.html'), 'utf-8');


// ==========================================
// 2. CONFIGURATION
// ==========================================
const TITLE = "Visualizing Light: 20 Styles for AI Art";
const SLUG = "visualizing-light-20-styles-for-ai-art";
const TARGET_ARTICLE_ID = 60146;

// ==========================================
// SCRIPT LOGIC
// ==========================================

async function main() {
    if (rawHtml === "PLACEHOLDER_FOR_HTML_CONTENT") {
        console.error("❌ ERROR: Please replace the placeholder with HTML content.");
        process.exit(1);
    }

    console.log("🚀 Starting content migration with generated FAQ...");

    // 1. Parse HTML to Blocks
    const blocks = parseHtmlToBlocks(rawHtml);
    console.log(`✅ Parsed ${blocks.length} blocks from HTML.`);

    // 2. Add Generated FAQ Block
    const faqBlock = {
        type: 'faq',
        items: [
            {
                question: "Can I use these lighting styles in other AI generators like Dall-E 3?",
                answer: "Yes! While the specific syntax might vary slightly between models, terms like \"Golden Hour,\" \"Cinematic Lighting,\" and \"Chiaroscuro\" are universally understood concepts in photography and art that most modern AI models (Dall-E 3, Stable Diffusion, etc.) will recognize and render effectively."
            },
            {
                question: "Why do my results look different than the examples?",
                answer: "AI image generation is non-deterministic, meaning that even with the exact same prompt, you will get a unique result every time. These prompts are designed to be starting points—feel free to re-roll or adjust the weights to get the look you want."
            },
            {
                question: "Do I need to place the lighting tag at the end of the prompt?",
                answer: "It is generally recommended. Placing style modifiers and lighting descriptions at the end of a prompt tends to help the AI apply them as a global filter over the entire scene, ensuring the lighting is consistent with your subject matter."
            }
        ]
    };

    blocks.push(faqBlock);
    console.log(`✅ Added FAQ block with ${faqBlock.items.length} items.`);

    // Log the block types found for verification
    const types = blocks.reduce((acc, b) => {
        acc[b.type] = (acc[b.type] || 0) + 1;
        return acc;
    }, {});
    console.log("Block types found:", types);

    if (TARGET_ARTICLE_ID) {
        console.log(`🔄 Updating Article ID: ${TARGET_ARTICLE_ID}...`);
        await updateArticle(TARGET_ARTICLE_ID, { content: JSON.stringify(blocks) });
        console.log("✅ Article updated successfully!");
    } else {
        console.log(`🆕 Creating new article: "${TITLE}"...`);
        const existing = await getArticleBySlug(SLUG);
        const slugToUse = existing ? `${SLUG}-${Date.now()}` : SLUG;

        const newId = await createArticle({
            title: TITLE,
            slug: slugToUse,
            content: JSON.stringify(blocks),
            excerpt: "Imported content",
            status: 'draft',
            featured: false,
        });
        console.log(`✅ New article created with ID: ${newId} and slug: ${slugToUse}`);
    }

    process.exit(0);
}

function parseHtmlToBlocks(html: string): any[] {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const blocks: any[] = [];
    let currentFaqItems: { question: string, answer: string }[] = [];
    let inFaqSection = false;

    const flushFaqs = () => {
        if (currentFaqItems.length > 0) {
            blocks.push({
                type: 'faq',
                items: [...currentFaqItems]
            });
            currentFaqItems = [];
        }
    };

    const elements = Array.from(doc.body.children);

    for (const el of elements) {
        const tagName = el.tagName.toLowerCase();

        // 1. Detect AI Prompts
        // Pattern: <p><strong>Prompt:</strong> ...</p>
        if (tagName === 'p') {
            const strong = el.querySelector('strong');
            if (strong && strong.textContent?.trim() === 'Prompt:') {
                // Extract text after "Prompt:"
                const fullText = el.textContent || "";
                const promptText = fullText.replace(/^Prompt:\s*/i, "").trim();

                blocks.push({
                    type: 'ai_prompt',
                    prompt: promptText
                });
                continue; // Skip normal paragraph processing
            }
        }

        // 2. Detect FAQ Section Start
        if (tagName.match(/^h[2-6]$/) && el.textContent?.toLowerCase().includes("faq")) {
            inFaqSection = true;
            if (el.textContent?.trim() !== "FAQ") {
                blocks.push({
                    type: 'heading',
                    level: parseInt(tagName[1]),
                    text: el.textContent
                });
            }
            continue;
        }

        // If in FAQ section, try to parse Q&A
        if (inFaqSection) {
            if (tagName.match(/^h[3-6]$/) || (tagName === 'p' && el.querySelector('strong'))) {
                const question = el.textContent?.trim() || "";
                currentFaqItems.push({ question, answer: "" });
                continue;
            }
            if (tagName === 'p' && currentFaqItems.length > 0 && currentFaqItems[currentFaqItems.length - 1].answer === "") {
                currentFaqItems[currentFaqItems.length - 1].answer = el.textContent?.trim() || "";
                continue;
            }
            if (tagName === 'h2') {
                flushFaqs();
                inFaqSection = false;
            }
        }

        // Normal Block Parsing
        if (tagName === 'p') {
            const img = el.querySelector('img');
            if (img) {
                blocks.push({
                    type: 'image',
                    url: img.getAttribute('src') || "",
                    alt: img.getAttribute('alt') || "",
                    caption: el.textContent?.replace(img.getAttribute('alt') || "", "").trim() || ""
                });
            } else {
                blocks.push({
                    type: 'paragraph',
                    text: el.innerHTML
                });
            }
        } else if (tagName.match(/^h[1-6]$/)) {
            blocks.push({
                type: 'heading',
                level: parseInt(tagName[1]),
                text: el.textContent
            });
        } else if (tagName === 'ul' || tagName === 'ol') {
            const items = Array.from(el.querySelectorAll('li')).map(li => li.innerHTML);
            blocks.push({
                type: 'list',
                listType: tagName === 'ul' ? 'bullet' : 'numbered',
                items: items
            });
        } else if (tagName === 'blockquote') {
            blocks.push({
                type: 'quote',
                text: el.textContent?.trim(),
                author: ""
            });
        } else if (tagName === 'figure') {
            const img = el.querySelector('img');
            const caption = el.querySelector('figcaption')?.textContent || "";
            if (img) {
                blocks.push({
                    type: 'image',
                    url: img.getAttribute('src') || "",
                    alt: img.getAttribute('alt') || "",
                    caption: caption
                });
            }
        } else if (tagName === 'div' && el.classList.contains('wp-block-image')) {
            const img = el.querySelector('img');
            const caption = el.querySelector('figcaption')?.textContent || "";
            if (img) {
                blocks.push({
                    type: 'image',
                    url: img.getAttribute('src') || "",
                    alt: img.getAttribute('alt') || "",
                    caption: caption
                });
            }
        } else {
            blocks.push({
                type: 'html',
                code: el.outerHTML
            });
        }
    }

    flushFaqs();
    return blocks;
}

main().catch(console.error);
