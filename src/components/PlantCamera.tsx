import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PlantCameraProps {
  onImageCapture: (imageFile: File, imageUrl: string) => void;
  onClose?: () => void;
}

export const PlantCamera: React.FC<PlantCameraProps> = ({ onImageCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      // Check if navigator.mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera is not supported on this device or browser. Please use the upload option.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
          setError('');
        };
      }
    } catch (err: any) {
      let errorMessage = 'Camera access denied. Please use the upload option.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please use the upload option.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this device. Please use the upload option.';
      }
      
      setError(errorMessage);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'plant-photo.jpg', { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          onImageCapture(file, imageUrl);
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      onImageCapture(file, imageUrl);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto p-6 bg-card/80 backdrop-blur-sm border-border shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Capture Your Plant</h3>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-fade-in">
            <div className="font-medium mb-1">Camera Issue</div>
            {error}
            {error.includes('permission') && (
              <div className="mt-2 text-xs">
                💡 Tip: Look for a camera icon in your browser's address bar to allow access
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {!isStreaming ? (
            <div className="space-y-3">
              <Button 
                variant="camera" 
                size="lg" 
                onClick={startCamera}
                className="w-full"
              >
                <Camera className="h-5 w-5" />
                Open Camera
              </Button>
              
              <div className="relative">
                <Button 
                  variant="nature" 
                  size="lg" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-5 w-5" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none"></div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={capturePhoto}
                  className="flex-1"
                >
                  <Camera className="h-5 w-5" />
                  Capture
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={stopCamera}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Card>
  );
};