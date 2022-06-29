import React, {useState, useRef} from 'react';

import { View, Text, Dimensions, KeyboardAvoidingView } from 'react-native';

import {Colors} from '../../Constants/Colors';

import {Octicons } from '@expo/vector-icons';

import {Formik} from 'formik';

import { useNavigation } from '@react-navigation/native';

import Flatlist from './Flatlist';

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

const Recipes = ({navigation} : Props) => {

    const [searchTerm, setSearchTerm] = useState("");

    const listRef = useRef();

    const addRecipe = () => {
        navigation.navigate("CreateStack", {screen: 'Create', params: {mode: 'Create'}});
    }

    return (
        <StyledContainer style={{ position: 'absolute', width: width }}>
            <InnerContainer style={{ position: 'absolute', width: width, top: 0}}>
                        <MySearchBar
                        icon="search"
                        placeholder="Search your recipes"
                        searchTerm={searchTerm}
                        onChange={setSearchTerm}
                        search={(e) => listRef.current.fetchResult({term: e})}
                        />
                        <View style={{
                            top: 50, 
                            position: 'absolute',
                        }}>
                        <Flatlist ref={listRef} navigation={navigation} />
                        </View>
                        <FloatingButton
                        onPress={addRecipe}
                        style={{position: 'absolute', right: 20}}
                        >
                            <Text> + </Text>
                        </FloatingButton>
            </InnerContainer>
        </StyledContainer>
    );
    
}

const MySearchBar = ({icon, searchTerm, onChange, search, ...props} : Props) => {

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            width: width,
        }}>
            <LeftIcon style={{ top : 20 }}>
                <Octicons name={icon} size={30} color={Colors.black} />
            </LeftIcon>
            <StyledSearchBar 
            value={searchTerm}
            onChangeText={e => onChange(e)}
            onSubmitEditing={() => {
                search(searchTerm);
            }}
            {...props} />
        </View>
    )
}

export default Recipes;