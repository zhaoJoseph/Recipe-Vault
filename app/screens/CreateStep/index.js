import React , {useContext, useEffect, useState} from 'react';

import {Text, TextInput, Button, View} from 'react-native';

import {tabContext} from '../../Context/tabContext';

import {recipeContext} from '../../Context/recipeContext';

import {userContext} from '../../Context/userContext';

import axios from 'axios';

import {Links} from '../../Constants/Links';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useToast } from "react-native-toast-notifications";

import {getToken} from '../../helpers';

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

const CreateStep = ({navigation, route} : Props) => {  

    const {tabs, setTabs } = useContext(tabContext);

    const {recipe, setRecipe} = useContext(recipeContext);

    const {loading, setLoading} = useContext(userContext);

    const [returnValue, setReturnValue] = useState(false);

    const [tabText, setTabText] = useState(tabs.find(tab =>{return tab.name == route.name}).text);

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
                initialParams: {mode: route.params.mode, name: route.params.name},
                text: '',
            }
        ])
    }

    useEffect(() => {
        if(route.params.mode == "Edit" && route.name == "Step 1"){
            var newTabs = [];
            newTabs = recipe.steps.map((elem, index) => {
                return {
                    name: 'Step ' + parseInt(index+1),
                    component: CreateStep,
                    stepTitle: 'Step ' + parseInt(index+1),
                    initialParams: {mode: route.params.mode, name:route.params.name},
                    text: elem,
                }
            })
            setTabs(newTabs);
            }
    },[])

    useEffect(() => {
        if(route.params.mode == "Edit"){
        setTabText(tabs.find(tab =>{return tab.name == route.name}).text);
        }
        setLoading(false);
    }, [tabs]);

    useEffect(() => {
        (async() =>{
        if(returnValue){
        var name = "";
        var url = "";
        let token = await getToken();
        var headers = {
            "Content-Type": "application/json",
            'authorization' : `Bearer ${token}`};
        if(route.params.mode == "Edit"){
        url = Links.recipe;
        name = route.params.name;
        }else{
        url = Links.recipesList;
        }
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        var body = {
            id: id,
            name: name,
            recipe: recipe,
        }
        axios.put(url,
        body,
        {
            headers
        })
        .then((response) => {
            token = null;
            listToast.show(response.data.message);

            navigation.reset({
            index: 0, 
            routes: [{name: 'Home'}],
            })
        }).catch((error) => {
            token = null;
            console.log(error.response.data.message);
            if(error.response.data.message && !(typeof error.response.data.message === 'object')){
                listToast.show(error.response.data.message);
            }else{
                listToast.show("An error occured while updating recipes.");
            }
            //navigation.navigate("Logout");
        })
        setReturnValue(false);
        }
        })();
    }, [recipe])

    const finishRecipe = () => {
        setReturnValue(true);

        var textArray = tabs.map(function(tab){ return tab.text; });
        setRecipe({...recipe, 
        steps: textArray,
        });
        
    }

    const handleChange = (route, value) => {
        const tab = tabs.find(tab =>{return tab.name == route.name});
        tab.text = value;
        setTabText(value);
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
                    value={tabText}
                    />
                </StyledFormArea>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 0,
                    justifyContent: 'space-between',
                    width: '100%',
                }}>
                {(tabs.length < 15) ? (<Button title="Add Step" onPress={addTab} />) : null}
                {(route.name != 'Step 1') ? (<Button title="Remove Step" onPress={() => removeTab(route)}/>) : null }
                <Button title="Finish Recipe" onPress={finishRecipe}/>
                </View>
            </InnerContainer>)}
        </StyledContainer> 

    )

}

export default CreateStep;