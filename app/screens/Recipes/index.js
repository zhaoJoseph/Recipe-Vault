import React, {useEffect, useState} from 'react';

import { View, Text, Dimensions, FlatList, ScrollView, VirtualizedView } from 'react-native';

import {Colors} from '../../Constants/Colors';

import {Octicons } from '@expo/vector-icons';

import {Formik} from 'formik';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

const Recipes = ({navigation}) => {

    const [list, setList] = useState([]);
    //TODO: render the user's current recipes and if none render a text requesting user to create recipes
    const getRecipes = (credentials) => {
    const url = "http://10.0.2.2:3000/recipesList";
    axios.get(url, {params: {
      id: credentials.id
      }}).then((res) => {
        setList([res.data.recipes]);
      }).catch((error) => {
        console.log(error);
    })  
  }

    useEffect(() => {
        AsyncStorage.getItem('id', (err, result) => {
            if(!err){
                getRecipes(JSON.parse(result));
            }
        })
    }, [list])

    const addRecipe = () => {
        navigation.navigate("CreateStack", {screen: 'Create'});
    }

    return (
        <StyledContainer>
            <InnerContainer>
                <Formik
                style={{
                    flex: 1,
                }}
                >
                {({...props}) => (
                    <View style={{
                        position: 'absolute',
                        height: "100%",
                        flex: 1,
                    }}>
                        <MySearchBar
                        icon="search"
                        placeholder="Search your recipes"
                        />
                        <View style={{ 
                            flex: 1,
                        }}>
                        {(list[0] && list[0].length > 0) ? (
                        <GridList 
                        columns={2}
                        items={list}
                        />) : 
                        <Text style={{ 
                            textAlign: 'center',
                        }}> Created recipes will show up here! </Text>
                        }
                        <FloatingButton
                        onPress={addRecipe}
                        >
                            <Text> + </Text>
                        </FloatingButton>
                        </View>
                    </View>)}
                </Formik>
            </InnerContainer>   
        </StyledContainer>
    );
}

const MySearchBar = ({icon, ...props}) => {
    return (
        <View style={{
            flex: 1,    
            height: 60,
            width: Dimensions.get('window').width,
            marginLeft: 10,
        }}>
            <LeftIcon>
                <Octicons name={icon} size={30} color={Colors.black} />
            </LeftIcon>
            <StyledSearchBar {...props}/>
        </View>
    )
}

const GridList = (props) => {
    return (
        
        <StyledFlatList
            key={props.columns}
            numColumns={props.columns}
            data={props.items}
            renderItem={({item}) => {
                return <RecipeContainer>{item.id}</RecipeContainer>
            }}
        />
    )

}

export default Recipes;