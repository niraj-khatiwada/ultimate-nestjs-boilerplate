import 'dotenv/config';
import { TypeormMarkdownGenerator } from 'typeorm-markdown-generator';
import { AppDataSource } from '../src/database/data-source';

const generateErd = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(AppDataSource, {
      entityPath: 'src/**/*.entity.ts',
      title: 'Postgres ERD',
      outFilePath: '.tmp/erd.md',
      indexTable: true,
    });
    await typeormMarkdown.build();
    console.log('\n\x1b[34mDatabase ERD generated successfully.');
  } catch (error) {
    console.error('\n\x1b[31mError generating ERD:', error);
  }
};

generateErd();