import fs from 'fs';
import path from 'path';

export async function getTranslations(lang: string) {
  const filePath = path.join(
    process.cwd(),
    `public/translations/${lang}.json`
  );

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Failed to read translations for language ${lang}:`, error);
    return {};
  }
}