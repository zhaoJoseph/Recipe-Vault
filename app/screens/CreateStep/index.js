import React , {useContext, useEffect, useState} from 'react';

import {Text, TextInput, Button, View} from 'react-native';

import {tabContext} from '../../Context/tabContext';

import {recipeContext} from '../../Context/recipeContext';

import {userContext} from '../../Context/userContext';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useToast } from "react-native-toast-notifications";

import {StyledContainer, 
        InnerContainer,
        StyledFormArea,
        LeftIcon,
        StyledTextLabel,
        StyledTextInput,
        ButtonText,
        StyledButton,
        StyledFlatList,
        IngredientContainer,
        StyledTextInputLarge,
} from '../../components/styles.js';

const CreateStep = ({navigation, route}) => {  

    const {tabs, setTabs } = useContext(tabContext);

    const {recipe, setRecipe} = useContext(recipeContext);

    const {loading, setLoading} = useContext(userContext);

    const [returnValue, setReturnValue] = useState(false);

    const listToast = useToast();

    const removeTab = (route) => {
        setLoading(!loading);
        const deleteItem = tabs.find(tab =>{return tab.name == route.name});
        setTabs(tabs => tabs.filter(tab => {if(tab.name != route.name){if(parseInt(tab.stepTitle.replace("Step ", "")) > parseInt(deleteItem.stepTitle.replace("Step ", ""))){tab.stepTitle = 'Step ' + (parseInt(tab.stepTitle.replace("Step ", "")) - 1);}     return tab;}}));
    }

    const addTab = () => {
        //console.log(tabs.pop().name.replace("Step ", ""));
        setLoading(!loading);
        const item = tabs[tabs.length - 1];

        setTabs([...tabs, 
            {
                name: 'Step ' + (parseInt(item.name.replace("Step ", ""))+1),
                component: CreateStep,
                stepTitle: 'Step ' + (parseInt(item.stepTitle.replace("Step ", ""))+1),
                text: '',
            }
        ])
    }

    useEffect(() => {
        setLoading(false);
    }, [tabs]);

    useEffect(async () => {
            console.log(returnValue);
        if(returnValue){
        const url = "https://foodapi-vs7cd2fg5a-uc.a.run.app/recipesList";
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        axios.post(url, {
            recipe: recipe,
            id: id.id,
        })
        .then((response) => {
            listToast.show(response.data.message);
        }).catch((error) => {
            listToast.show(response.data.message);
        })
        setReturnValue(false);
        }
    }, [recipe])

    const finishRecipe = () => {
        setReturnValue(true);

        var textArray = tabs.map(function(tab){ return tab.text; });
        setRecipe({...recipe, 
        steps: textArray,
        });
        
        navigation.reset({
            index: 0, 
            routes: [{name: 'Home'}],
        })
    }

    const handleChange = (route, value) => {
        const tab = tabs.find(tab =>{return tab.name == route.name});
        tab.text = value;
    }

    return (
            <StyledContainer>
            {loading ? <View>
                <Text>
                    Loading...
                </Text>
            </View> : 
            (<InnerContainer>
                <StyledFormArea>    
                    <StyledTextInputLarge 
                    multiline={true} 
                    onChangeText={(value)=> handleChange(route, value)}
                    />
                </StyledFormArea>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 5,
                    width: '100%',
                }}>
                {(tabs.length < 10) ? (<Button title="Add Step" onPress={addTab}/>) : null}
                {(route.name != 'Step 1') ? (<Button title="Remove Step" onPress={() => removeTab(route)}/>) : null }
                <Button title="Finish Recipe" onPress={finishRecipe}/>
                </View>
            </InnerContainer>)}
        </StyledContainer> 

    )

}

export default CreateStep;