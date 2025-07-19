import React, { useState } from 'react';
import { Loader2, Leaf, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlantData {
  name: string;
  scientificName: string;
  commonNames: string[];
  careInstructions: {
    light: string;
    water: string;
    temperature: string;
    humidity?: string;
  };
  affirmation: string;
  confidence: number;
}

interface PlantIdentificationProps {
  imageFile: File;
  imageUrl: string;
  onNewScan: () => void;
}

// PlantNet API configuration
const PLANTNET_API_KEY = '2b10Uh198814l9gNfEqHE7y79';
const PLANTNET_API_URL = 'https://my-api.plantnet.org/v2/identify';

// Basic care instructions by plant family
const getCareInstructions = (familyName?: string) => {
  const familyCare: { [key: string]: any } = {
    'Araceae': {
      light: "Bright, indirect light",
      water: "Water when top inch of soil feels dry",
      temperature: "65-80°F (18-27°C)",
      humidity: "50-60%"
    },
    'Asparagaceae': {
      light: "Low to bright indirect light",
      water: "Water every 2-6 weeks when soil is dry",
      temperature: "70-90°F (21-32°C)",
      humidity: "30-50%"
    },
    'Lamiaceae': {
      light: "Bright, indirect light",
      water: "Water when soil surface feels dry",
      temperature: "65-75°F (18-24°C)",
      humidity: "40-60%"
    }
  };
  
  return familyCare[familyName || ''] || {
    light: "Bright, indirect light",
    water: "Water when soil surface feels dry",
    temperature: "65-75°F (18-24°C)",
    humidity: "40-60%"
  };
};

// Generate affirmations based on plant characteristics
const generateAffirmation = (plantName: string): string => {
  const affirmations = [
    `Like the resilient ${plantName}, you adapt and thrive in any environment life presents to you. Your strength shines through every challenge. 🌿`,
    `Just as ${plantName} grows steadily towards the light, you continue to reach for your highest potential with grace and determination. ✨`,
    `Like the beautiful ${plantName}, you bring natural harmony and peace to every space you enter. Your presence is a gift. 🌱`,
    `Just as ${plantName} purifies the air around it, your positive energy brings clarity and freshness to others. 💚`,
    `Like the patient ${plantName}, you understand that growth takes time, and you trust your unique journey with wisdom. 🌸`
  ];
  
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

export const PlantIdentification: React.FC<PlantIdentificationProps> = ({ 
  imageFile, 
  imageUrl, 
  onNewScan 
}) => {
  const [isIdentifying, setIsIdentifying] = useState(true);
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [error, setError] = useState<string>('');

  // Plant identification using PlantNet API
  React.useEffect(() => {
    const identifyPlant = async () => {
      try {
        setIsIdentifying(true);
        setError('');
        
        // Prepare form data for PlantNet API
        const formData = new FormData();
        formData.append('images', imageFile);
        formData.append('organs', 'auto');
        formData.append('modifiers', 'crops,fake_fruits,latin');
        formData.append('plant-language', 'en');
        formData.append('plant-details', 'common_names');
        
        // Call PlantNet API
        const response = await fetch(`${PLANTNET_API_URL}/all?api-key=${PLANTNET_API_KEY}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to identify plant (${response.status})`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
          throw new Error('No plant species could be identified. Try with a clearer image.');
        }

        // Get the best match
        const bestResult = data.results[0];
        const species = bestResult.species;
        
        // Extract plant information
        const plantName = species.commonNames && species.commonNames.length > 0 
          ? species.commonNames[0] 
          : species.scientificNameWithoutAuthor;

        const careInstructions = getCareInstructions(species.family?.scientificNameWithoutAuthor);
        
        const plantInfo: PlantData = {
          name: plantName,
          scientificName: species.scientificName,
          commonNames: species.commonNames || [],
          careInstructions,
          confidence: Math.round(bestResult.score * 100),
          affirmation: generateAffirmation(plantName)
        };

        setPlantData(plantInfo);
      } catch (err: any) {
        console.error('Plant identification error:', err);
        setError(err.message || 'Failed to identify plant. Please try again with a clearer image.');
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