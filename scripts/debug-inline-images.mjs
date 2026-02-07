import { readFileSync } from 'fs';

const S3_FILE = '/home/ubuntu/wordpress-articles-export/articles-with-s3-urls.json';
const articles = JSON.parse(readFileSync(S3_FILE, 'utf8'));

const article = articles.find(a => a.title.includes('Framing the Martyr'));

console.log('Title:', article.title);
console.log('inlineImages:', article.inlineImages);
console.log('inlineImages length:', article.inlineImages?.length || 0);
console.log('inlineImages || []:', (article.inlineImages || []).length);
