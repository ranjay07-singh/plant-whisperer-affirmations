import React, { useState } from 'react';
import { Camera, Sparkles, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlantCamera } from './PlantCamera';
import { PlantIdentification } from './PlantIdentification';
import heroPlant from '@/assets/hero-plant.jpg';

type AppState = 'welcome' | 'camera' | 'identifying';

interface CapturedImage {
  file: File;
  url: string;
}

export const PlantWhisperer: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);

  const handleImageCapture = (file: File, url: string) => {
    setCapturedImage({ file, url });
    setAppState('identifying');
  };

  const handleNewScan = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
    setAppState('camera');
  };

  const handleStartScan = () => {
    setAppState('camera');
  };

  if (appState === 'camera') {
    return (
      <div className="min-h-screen bg-gradient-forest flex items-center justify-center p-4">
        <PlantCamera 
          onImageCapture={handleImageCapture}
          onClose={() => setAppState('welcome')}
        />
      </div>
    );
  }

  if (appState === 'identifying' && capturedImage) {
    return (
      <div className="min-h-screen bg-gradient-forest p-4 py-8">
        <PlantIdentification 
          imageFile={capturedImage.file}
          imageUrl={capturedImage.url}
          onNewScan={handleNewScan}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-forest">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroPlant})` }}
        >
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Leaf className="h-12 w-12 text-primary animate-float" />
              <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                Plant Whisperer
              </h1>
              <Sparkles className="h-12 w-12 text-primary-glow animate-gentle-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Discover your plants, nurture your soul with daily affirmations inspired by nature's wisdom
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleStartScan}
              className="text-lg px-8 py-4 h-auto"
            >
              <Camera className="h-6 w-6" />
              Start Your Plant Journey
            </Button>
            
            <p className="text-foreground/60 text-sm">
              Snap a photo • Get plant care tips • Receive daily affirmations
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Plant Whisperer Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to connect with nature and find your daily dose of mindfulness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-nature rounded-full flex items-center justify-center mx-auto">
                  <Camera className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    1. Capture
                  </h3>
                  <p className="text-muted-foreground">
                    Take a photo of any plant using your camera or upload from your gallery
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-nature rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    2. Identify & Learn
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI identifies your plant and provides personalized care instructions
                  </p>
                </div>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-nature rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    3. Feel Inspired
                  </h3>
                  <p className="text-muted-foreground">
                    Receive beautiful affirmations inspired by your plant's unique qualities
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button 
              variant="nature" 
              size="lg" 
              onClick={handleStartScan}
              className="text-lg px-8 py-4 h-auto"
            >
              Try It Now
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Plant Whisperer</span>
          </div>
          <p className="text-muted-foreground">
            Connecting you with nature, one plant at a time
          </p>
        </div>
      </footer>
    </div>
  );
};