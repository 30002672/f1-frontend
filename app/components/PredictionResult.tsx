import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PredictionResultProps {
  position: number | null;
}

export function PredictionResult({ position }: PredictionResultProps) {
  if (position === null) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Predicted Position</CardTitle>
        <CardDescription>Based on current conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center">
          P{Math.round(position)}
        </p>
      </CardContent>
    </Card>
  );
}