import React, {Component} from 'react';

import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Animated, PanResponder, Alert, ToastAndroid, ImageBackground} from 'react-native';

import {Colors} from '../../Constants/Colors';

import {Octicons } from '@expo/vector-icons';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import {getToken} from '../../helpers';

import { PropTypes } from 'prop-types';

import {Links} from '../../Constants/Links';

import {
    StyledFormArea, 
    StyledContainer,
    InnerContainer,
    LeftIcon,
    StyledSearchBar,
    GridContainer,
    RecipeContainer,
    StyledFlatList,
    FloatingButton,
    ButtonView,
    } from '../../components/styles.js';

const {width} = Dimensions.get('window');

class RecipeItem extends Component {

    constructor(props : Props) {
        super(props);

        this.gestureDelay = -35;
        this.scrollViewEnabled = true;

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dx > 35 && this.props.index % 2 == 1) {
            this.setScrollViewEnabled(false);
            let newX = gestureState.dx + this.gestureDelay;
            position.setValue({x: newX, y: 0});
            }else if(gestureState.dx < -35 && this.props.index % 2 == 0){
            this.setScrollViewEnabled(false);
            let newX = gestureState.dx + this.gestureDelay;
            position.setValue({x: newX, y: 0});
            }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if ((gestureState.dx < 150 && this.props.index % 2 == 1) || (gestureState.dx > -150 && this.props.index % 2 == 0)) {
                Animated.timing(this.state.position, {
                    toValue: {x: 0, y: 0},
                    duration: 150,
                    useNativeDriver: false,
                }).start(() => {
                    this.setScrollViewEnabled(true);
                });
                } else {
                Animated.timing(this.state.position, {
                    toValue: {x: (this.props.index % 2 == 0) ? -width : width, y: 0},
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    Alert.alert(
                        "Confirm Deletion",
                        "To confirm permanent deletion press Yes.",
                        [
                            {
                                text: "Yes",
                                onPress: () => {
                                    // remove the item
                                    this.remove();
                                },
                            },
                            {
                                text: "Cancel",
                                onPress: () => {
                                    // reset view position. 
                                    Animated.timing(this.state.position, {
                                        toValue: {x: 0, y: 0},
                                        duration: 150,
                                        useNativeDriver: false,
                                      }).start();
                                }
                            }
                        ]
                    );
                    this.setScrollViewEnabled(true);
                });
                }
            },
        });

        this.Panresponder = panResponder;
        this.state = {
            position,
            color: this.props.item.image ? "" : this.generateColor(),
        }

    } 

  setScrollViewEnabled(enabled) {
    if (this.scrollViewEnabled !== enabled) {
      this.props.setScrollEnabled(enabled);
      this.scrollViewEnabled = enabled;
    }
  }

  notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(msg);
    }
  }

  remove(){
    (async () => {
        const url = Links.recipe;
        let token = await getToken();
        var headers = {
          "Content-Type": "application/json",
          'authorization' : `Bearer ${token}`};
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        var data = {
            name: this.props.item.id,
            id: id,
        }
        axios.delete(url, 
            {
                headers: headers,
                data: data,
            })
        .then((response) => {
            token = null;
            this.props.removeFromList(response.data, this.props.item.id);
        }).catch((error) => {
            console.log(error);
            token = null;
            this.notifyMessage(response.data.message);
            this.props.navigation.navigate("Home");
        });
    })();
    }

    generateColor() {
        var color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        return color;
      };


  render() {

    var recipeComponent = (
        <RecipeContainer
            onPress={() => {this.props.navigation.navigate("View Recipe", {name: `${this.props.item.id}`});}}
            > 
            <Text style={{ 
                fontWeight: 'bold',
                textShadowColor: 'white', 
                textShadowOffset: { width: -1, height: 0 },
                textShadowRadius: 10, 
            }}>{this.props.item.id}</Text>
            <View style={{
                position: 'absolute',
                bottom: 0,
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                backgroundColor: 'transparent',
            }} >
            <View>
            <Octicons onPress={() => this.props.navigation.navigate("CreateStack", {screen: 'Create', params: {mode: 'Edit', name: `${this.props.item.id}`}})} 
                                        name="pencil" size={25} color={Colors.black}/>
            </View>
            </View>
        </RecipeContainer>
    );

        return (
            <View style={{
                width: '50%'
            }}>
                <Animated.View style={[this.state.position.getLayout()]} {...this.Panresponder.panHandlers}>
                {(this.state.color == '') ? 
                (<ImageBackground source={{ uri: this.props.item.image }} resizeMode="cover">{recipeComponent}</ImageBackground>) 
                : 
                <View 
                style={{ backgroundColor: this.state.color, }}>{recipeComponent}</View>}
                </Animated.View>
            </View>
        );
    }
}

RecipeItem.propTypes = {
    index: PropTypes.number.isRequired,
    setScrollEnabled: PropTypes.func.isRequired,
    removeFromList: PropTypes.func.isRequired,
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.string
    }).isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired
    }).isRequired
}

export default RecipeItem;