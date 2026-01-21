import React, { useState } from 'react';
import { View, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeOut,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { cn } from '@/shared/utils/cn';
import { getMediaUrl } from '@/shared/utils/media';

interface CourseHeroImageProps {
  /** Image source (URL or local) */
  source?: ImageSourcePropType | string;
  /** Course ID for generating unique gradient */
  courseId: string;
  /** Height of hero image */
  height?: number;
  /** Additional className */
  className?: string;
}

// Premium gradient presets - vibrant & modern
const heroGradients: readonly [string, string, string][] = [
  ['#667eea', '#764ba2', '#f093fb'], // Purple Dream
  ['#f093fb', '#f5576c', '#fe5196'], // Pink Passion
  ['#4facfe', '#00f2fe', '#43e97b'], // Ocean Blue
  ['#43e97b', '#38f9d7', '#30cfd0'], // Mint Fresh
  ['#fa709a', '#fee140', '#ffd89b'], // Sunset Glow
  ['#30cfd0', '#330867', '#667eea'], // Deep Ocean
  ['#a8edea', '#fed6e3', '#fbc2eb'], // Pastel Dream
  ['#ff9a9e', '#fecfef', '#ffdde1'], // Rose Garden
  ['#ffecd2', '#fcb69f', '#ff9a9e'], // Peach Fizz
  ['#ff6e7f', '#bfe9ff', '#a8edea'], // Sky Candy
];

export function CourseHeroImage({
  source,
  courseId,
  height = 260,
  className,
}: CourseHeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Select gradient based on course ID
  const gradientIndex = parseInt(courseId.slice(0, 8), 16) % heroGradients.length;
  const gradientColors = heroGradients[gradientIndex];

  // Shimmer animation
  const shimmerTranslate = useSharedValue(-1);
  
  React.useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.linear }),
        withTiming(-1, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerTranslate.value * 400 }],
    };
  });

  // Determine the image source
  let imageSource: ImageSourcePropType | null = null;
  if (source && !hasError) {
    if (typeof source === 'string') {
      // Convert relative path to full URL
      const fullUrl = getMediaUrl(source);
      imageSource = fullUrl ? { uri: fullUrl } : null;
    } else {
      imageSource = source;
    }
  }

  const shouldShowImage = imageSource && !hasError;

  return (
    <View
      className={cn('relative overflow-hidden bg-gray-200 dark:bg-gray-800', className)}
      style={{ height }}
    >
      {shouldShowImage ? (
        <>
          {/* Loading Shimmer */}
          {isLoading && (
            <Animated.View 
              className="absolute inset-0 z-10"
              exiting={FadeOut.duration(300)}
            >
              <LinearGradient
                colors={['#e5e7eb', '#f3f4f6', '#e5e7eb'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
              <Animated.View 
                style={[
                  { 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 100,
                  },
                  shimmerStyle
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent'] as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </Animated.View>
          )}
          
          {/* Hero Image */}
          {imageSource && (
            <Animated.Image
              source={imageSource}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                width: '100%', 
                height: '100%' 
              }}
              resizeMode="cover"
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />
          )}

          {/* Gradient Overlay for depth */}
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.1)', 
              'rgba(0,0,0,0.3)',
              'rgba(0,0,0,0.5)'
            ] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </>
      ) : (
        <>
          {/* Premium Gradient Background */}
          <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Animated Shapes */}
          <View className="absolute inset-0">
            {/* Large circle - top right */}
            <Animated.View 
              entering={FadeIn.delay(100).duration(800)}
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20"
            />
            {/* Medium circle - left */}
            <Animated.View 
              entering={FadeIn.delay(200).duration(800)}
              className="absolute -left-12 top-1/4 w-56 h-56 rounded-full bg-black/10"
            />
            {/* Small circle - center right */}
            <Animated.View 
              entering={FadeIn.delay(300).duration(800)}
              className="absolute right-1/4 bottom-12 w-48 h-48 rounded-full bg-white/15"
            />
            {/* Extra small - bottom left */}
            <Animated.View 
              entering={FadeIn.delay(400).duration(800)}
              className="absolute left-1/3 -bottom-8 w-64 h-64 rounded-full bg-black/10"
            />
          </View>

          {/* Noise texture overlay */}
          <View 
            className="absolute inset-0 opacity-5"
            style={{ backgroundColor: '#000' }}
          />
        </>
      )}
    </View>
  );
}
