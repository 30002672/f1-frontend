"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GaugeCircle, Thermometer, Timer, Wind } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PredictionResult } from "./components/PredictionResult";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    LapNumber: 10,
    LapTime: 95.4,
    TyreLife: 12,
    Speedl1: 310.5,
    Speedl2: 315.2,
    SpeedFL: 320.1,
    SpeedST: 312.8,
    AirTemp: 27.5,
    TrackTemp: 35.0,
    Humidity: 60,
    WindSpeed: 5.2,
    Compound: "2",
    Compound2: "3"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    
    try {
      const requestData = {
        LapNumber: Number(formData.LapNumber),
        LapTime: Number(formData.LapTime),
        TyreLife: Number(formData.TyreLife),
        Speedl1: Number(formData.Speedl1),
        Speedl2: Number(formData.Speedl2),
        SpeedFL: Number(formData.SpeedFL),
        SpeedST: Number(formData.SpeedST),
        AirTemp: Number(formData.AirTemp),
        TrackTemp: Number(formData.TrackTemp),
        Humidity: Number(formData.Humidity),
        WindSpeed: Number(formData.WindSpeed),
        Compound: Number(formData.Compound),
        Compound2: Number(formData.Compound2)
      };

      const response = await fetch("https://f1-backend-dj4j.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data && typeof data.predicted_position === 'number' && !isNaN(data.predicted_position)) {
        setPrediction(data.predicted_position);
        toast.success("Prediction calculated successfully!");
      } else {
        throw new Error('Invalid prediction value received from API');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compounds = [
    { value: "1", label: "Soft" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Hard" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">F1 Position Predictor</h1>
          <p className="text-muted-foreground">Enter race conditions to predict driver position</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lap Information</CardTitle>
                <CardDescription>Basic lap and timing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lap Number</label>
                  <Input
                    type="number"
                    value={formData.LapNumber}
                    onChange={(e) => handleChange("LapNumber", Number(e.target.value))}
                    min="1"
                    max="78"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lap Time (seconds)</label>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <Input
                      type="number"
                      value={formData.LapTime}
                      onChange={(e) => handleChange("LapTime", Number(e.target.value))}
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tyre Life (laps)</label>
                  <Input
                    type="number"
                    value={formData.TyreLife}
                    onChange={(e) => handleChange("TyreLife", Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speed Data</CardTitle>
                <CardDescription>Speed measurements across sectors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Speedl1", "Speedl2", "SpeedFL", "SpeedST"].map((speed) => (
                  <div key={speed} className="space-y-2">
                    <label className="text-sm font-medium">
                      {speed.replace("Speed", "Speed ")} (km/h)
                    </label>
                    <div className="flex items-center gap-2">
                      <GaugeCircle className="w-4 h-4" />
                      <Slider
                        value={[formData[speed as keyof typeof formData] as number]}
                        onValueChange={(value) => handleChange(speed, value[0])}
                        min={250}
                        max={350}
                        step={0.1}
                      />
                      <span className="w-12 text-sm">{formData[speed as keyof typeof formData]}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather Conditions</CardTitle>
                <CardDescription>Current track and weather data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Air Temperature (°C)</label>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    <Slider
                      value={[formData.AirTemp]}
                      onValueChange={(value) => handleChange("AirTemp", value[0])}
                      min={15}
                      max={40}
                      step={0.5}
                    />
                    <span className="w-12 text-sm">{formData.AirTemp}°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Track Temperature (°C)</label>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    <Slider
                      value={[formData.TrackTemp]}
                      onValueChange={(value) => handleChange("TrackTemp", value[0])}
                      min={20}
                      max={50}
                      step={0.5}
                    />
                    <span className="w-12 text-sm">{formData.TrackTemp}°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Humidity (%)</label>
                  <Input
                    type="number"
                    value={formData.Humidity}
                    onChange={(e) => handleChange("Humidity", Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wind Speed (m/s)</label>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    <Input
                      type="number"
                      value={formData.WindSpeed}
                      onChange={(e) => handleChange("WindSpeed", Number(e.target.value))}
                      step="0.1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tyre Compounds</CardTitle>
                <CardDescription>Current and previous tyre selections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Compound</label>
                  <Select
                    value={formData.Compound}
                    onValueChange={(value) => handleChange("Compound", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compound" />
                    </SelectTrigger>
                    <SelectContent>
                      {compounds.map((compound) => (
                        <SelectItem key={compound.value} value={compound.value}>
                          {compound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Previous Compound</label>
                  <Select
                    value={formData.Compound2}
                    onValueChange={(value) => handleChange("Compound2", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous compound" />
                    </SelectTrigger>
                    <SelectContent>
                      {compounds.map((compound) => (
                        <SelectItem key={compound.value} value={compound.value}>
                          {compound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Calculating..." : "Predict Position"}
            </Button>

            <PredictionResult position={prediction} />
          </div>
        </form>
      </div>
    </main>
  );
}