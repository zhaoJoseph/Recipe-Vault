import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Lottie from 'lottie-react-native';

export default function TabIcon(props: Props) {
  const animationProgress = useRef(new Animated.Value(0))

  useEffect(() => {

    var toValue = 0.5;

    if(props.deleteTab){
      toValue = 1.0;
    }

    Animated.timing(animationProgress.current, {
      toValue: toValue,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, [props.deleteTab])


  return (
     <Lottie
      source={require('../../../assets/paper.json')}
      progress={animationProgress.current}
      style={{
        height: 40
      }} 
    />
  );
}