import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';
const articles = JSON.parse(readFileSync(S3_FILE, 'utf8'));

// Find article with images
const article = articles.find(a => a.title.includes('Framing the Martyr'));

console.log('Article:', article.title);
console.log('inlineImages count:', article.inlineImages.length);
console.log('\nHTML length:', article.content.length);
console.log('\nHTML snippet:', article.content.substring(0, 500));

const dom = new JSDOM(article.content);
const imgTags = dom.window.document.querySelectorAll('img');

console.log('\nImages found by querySelectorAll:', imgTags.length);

if (imgTags.length > 0) {
  console.log('\nFirst img tag:');
  console.log(imgTags[0].outerHTML.substring(0, 200));
}
