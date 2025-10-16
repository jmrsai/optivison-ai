'use server';

/**
 * @fileOverview An AI flow for generating a database schema from an application description.
 *
 * - generateSchema - A function that handles the schema generation process.
 * - GenerateSchemaInput - The input type for the generateSchema function.
 * - GenerateSchemaOutput - The return type for the generateSchema function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSchemaInputSchema = z.object({
  description: z.string().describe('A detailed description of the application and its data requirements.'),
});
export type GenerateSchemaInput = z.infer<typeof GenerateSchemaInputSchema>;

const GenerateSchemaOutputSchema = z.object({
  schema: z.string().describe('A JSON string representing the database schema. It should define tables, columns with types, and relationships.'),
});
export type GenerateSchemaOutput = z.infer<typeof GenerateSchemaOutputSchema>;

export async function generateSchema(input: GenerateSchemaInput): Promise<GenerateSchemaOutput> {
  return generateSchemaFlow(input);
}

const generateSchemaPrompt = ai.definePrompt({
  name: 'generateSchemaPrompt',
  input: { schema: GenerateSchemaInputSchema },
  output: { schema: GenerateSchemaOutputSchema },
  prompt: `You are an expert database architect. Your task is to design a structured JSON schema for a relational database based on an application description.

The output should be a JSON object where:
- Each key is a table name.
- Each table object contains a 'columns' object and an optional 'relations' array.
- The 'columns' object has keys for each column name, and the value is another object specifying the column's 'type' (e.g., 'id', 'text', 'integer', 'boolean', 'timestamp', 'foreignKey'), and an optional 'description'.
- The 'relations' array contains objects defining relationships, specifying the 'type' (e.g., 'one-to-many', 'many-to-one'), 'targetTable', and 'foreignKey'.

Application Description:
{{{description}}}

Generate the JSON schema now.`,
});

const generateSchemaFlow = ai.defineFlow(
  {
    name: 'generateSchemaFlow',
    inputSchema: GenerateSchemaInputSchema,
    outputSchema: GenerateSchemaOutputSchema,
  },
  async (input) => {
    const { output } = await generateSchemaPrompt(input);
    return output!;
  }
);
