import React, { useState } from 'react';
import { Loader2, Leaf, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlantData {
  name: string;
  scientificName: string;
  careInstructions: {
    light: string;
    water: string;
    temperature: string;
    humidity?: string;
  };
  affirmation: string;
  confidence?: number;
}

interface PlantIdentificationProps {
  imageFile: File;
  imageUrl: string;
  onNewScan: () => void;
}

// Mock plant database - in production, this would use TensorFlow.js or external API
const mockPlantDatabase: PlantData[] = [
  {
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    careInstructions: {
      light: "Bright, indirect light",
      water: "Water when top 1-2 inches of soil are dry",
      temperature: "65-75°F (18-24°C)",
      humidity: "30-65%"
    },
    affirmation: "Like this fiddle leaf fig, you stand tall and graceful, bringing natural beauty to every space you enter. Your presence creates harmony and peace. 🌿"
  },
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    careInstructions: {
      light: "Low to bright, indirect light",
      water: "Water every 2-6 weeks when soil is dry",
      temperature: "70-90°F (21-32°C)",
      humidity: "30-50%"
    },
    affirmation: "Just like the resilient snake plant, you thrive in any environment. Your strength and adaptability inspire those around you. You purify the energy wherever you go. 💚"
  },
  {
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    careInstructions: {
      light: "Medium to bright, indirect light",
      water: "Water when top inch of soil is dry",
      temperature: "65-85°F (18-29°C)",
      humidity: "50-60%"
    },
    affirmation: "Like the monstera's beautiful splits and fenestrations, your unique qualities make you extraordinary. Embrace your individual beauty and let yourself grow wild and free. 🌱"
  },
  {
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    careInstructions: {
      light: "Low to medium, indirect light",
      water: "Keep soil consistently moist but not soggy",
      temperature: "65-80°F (18-27°C)",
      humidity: "40-50%"
    },
    affirmation: "Like the peace lily's serene white blooms, you bring tranquility and grace to every situation. Your gentle strength creates harmony in chaos. ☮️"
  }
];

export const PlantIdentification: React.FC<PlantIdentificationProps> = ({ 
  imageFile, 
  imageUrl, 
  onNewScan 
}) => {
  const [isIdentifying, setIsIdentifying] = useState(true);
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [error, setError] = useState<string>('');

  // Simulate plant identification
  React.useEffect(() => {
    const identifyPlant = async () => {
      try {
        setIsIdentifying(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock identification - randomly select a plant
        const randomPlant = mockPlantDatabase[Math.floor(Math.random() * mockPlantDatabase.length)];
        setPlantData({
          ...randomPlant,
          confidence: Math.floor(Math.random() * 15) + 85 // 85-99% confidence
        });
        
        setError('');
      } catch (err) {
        setError('Failed to identify plant. Please try again.');
        console.error('Identification error:', err);
      } finally {
        setIsIdentifying(false);
      }
    };

    identifyPlant();
  }, [imageFile]);

  if (isIdentifying) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 bg-gradient-forest border-border shadow-soft animate-grow">
        <div className="text-center space-y-6">
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Plant being identified" 
              className="w-48 h-48 object-cover rounded-lg mx-auto shadow-soft"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-lg animate-gentle-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium text-foreground">Identifying your plant...</span>
            </div>
            <p className="text-muted-foreground">
              Using AI to analyze plant characteristics
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 bg-card border-destructive/20 shadow-soft">
        <div className="text-center space-y-4">
          <img 
            src={imageUrl} 
            alt="Plant photo" 
            className="w-48 h-48 object-cover rounded-lg mx-auto shadow-soft"
          />
          <div className="text-destructive">{error}</div>
          <Button variant="default" onClick={onNewScan}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!plantData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-grow">
      {/* Plant Image and Basic Info */}
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border shadow-soft">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img 
              src={imageUrl} 
              alt={plantData.name} 
              className="w-full h-64 object-cover rounded-lg shadow-soft"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                {plantData.name}
              </h2>
              <p className="text-muted-foreground italic">{plantData.scientificName}</p>
              {plantData.confidence && (
                <p className="text-sm text-primary">
                  {plantData.confidence}% confidence
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Care Instructions:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>💡 Light:</strong> {plantData.careInstructions.light}</div>
                <div><strong>💧 Water:</strong> {plantData.careInstructions.water}</div>
                <div><strong>🌡️ Temperature:</strong> {plantData.careInstructions.temperature}</div>
                {plantData.careInstructions.humidity && (
                  <div><strong>💨 Humidity:</strong> {plantData.careInstructions.humidity}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Affirmation */}
      <Card className="p-6 bg-gradient-sunrise border-primary/20 shadow-glow">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-gentle-pulse" />
            <h3 className="text-xl font-semibold text-foreground">Your Daily Plant Affirmation</h3>
            <Sparkles className="h-6 w-6 text-primary animate-gentle-pulse" />
          </div>
          
          <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">
            {plantData.affirmation}
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="default" size="lg" onClick={onNewScan}>
          Scan Another Plant
        </Button>
        <Button variant="nature" size="lg">
          Save to Collection
        </Button>
      </div>
    </div>
  );
};