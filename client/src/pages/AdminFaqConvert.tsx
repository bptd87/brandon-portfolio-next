import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminFaqConvert() {
  const [result, setResult] = useState<string>('');
  const convertMutation = trpc.articles.convertFaqToAccordion.useMutation();

  const handleConvert = async () => {
    try {
      setResult('Converting...');
      const response = await convertMutation.mutateAsync({ slug: 'lighting-styles-in-ai-models' });
      setResult(`Success! Converted ${response.faqItemsCount} FAQ items to accordion format.`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">FAQ Conversion Tool</h1>
        <p className="mb-6 text-muted-foreground">
          This tool converts the plain-text FAQ section in the "Lighting Styles in AI Models" article
          into an interactive accordion format.
        </p>
        
        <Button 
          onClick={handleConvert}
          disabled={convertMutation.isPending}
        >
          {convertMutation.isPending ? 'Converting...' : 'Convert FAQ to Accordion'}
        </Button>
        
        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="font-mono text-sm">{result}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
