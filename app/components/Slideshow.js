import React, {useState, useEffect, useRef} from 'react';

import {View, Image, Animated, ImageBackground} from 'react-native';

import { PropTypes } from 'prop-types';

import {Images} from '../Constants';

import { 
    StyledContainer, 
    InnerContainer, 
    PageLogo, 
    PageTitle,
    PageSubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputArea,
    StyledTextInput, 
    StyledButton,
    ButtonText,
    StyledTextLabel,
    RightIcon,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
  } from './styles.js';

const getAnimatedValue = (value: Animated.Value) => Number.parseInt(JSON.stringify(value));

export const Slideshow = () => {

    const images1 = [];
    const images2 = [];

    Images.forEach((img, index) => {
        (index % 2 === 0 ? images1 : images2).push(img.src)
    });
    const images1Index = useRef(0);
    const images2Index = useRef(0);
    const image1Opacity = useRef(new Animated.Value(1)).current;
    const image2Opacity = useRef(new Animated.Value(2)).current;

    useEffect(() => {
        const swapImageInterval = setInterval(() => {
            const newImage1Opacity = getAnimatedValue(image1Opacity) === 1 ? 0 : 1;
            const newImage2Opacity = getAnimatedValue(image2Opacity) === 1 ? 0 : 1;

            Animated.parallel([
                Animated.timing(image1Opacity, {
                    toValue: newImage1Opacity,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(image2Opacity, {
                    toValue: newImage2Opacity,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                if (newImage1Opacity === 1) {
                    // image 2 is now faded out, so we can swap out its source
                    const nextIndex = images2Index.current === images2.length - 1 ? 0 : images2Index.current + 1;
                    images2Index.current = nextIndex;
                  } else {
                    // image 1 is faded out, so we can swap out its source 
                    const nextIndex = images1Index.current === images1.length - 1 ? 0 : images1Index.current + 1;
                    images1Index.current = nextIndex;
                  }
            })
        }, 5000)

        return () => clearInterval(swapImageInterval);
    },[images1Index, images2Index])

    return( 
        <View style={{flex: 1, height: '150%', width: '150%', position: 'absolute', color: 'white', opacity: 0.3}}>
        <Animated.Image style={{flex: 1, height: "100%", width: '100%', resizeMode: 'cover', opacity: image1Opacity, position: 'absolute', }} source={images1[images1Index.current]}/>
        <Animated.Image  style={{flex: 1, height: "100%", width: '100%', resizeMode: 'cover', opacity: image2Opacity, position: 'absolute', }} source={images2[images2Index.current]}/>
        </View>
    )
}