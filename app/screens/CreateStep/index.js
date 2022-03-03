import React , {useContext, useEffect} from 'react';

import {Text, TextInput, Button, View} from 'react-native';

import {tabContext} from '../../Context/tabContext';

import {recipeContext} from '../../Context/recipeContext';

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

    const removeTab = (route) => {
        const deleteItem = tabs.find(tab =>{return tab.name == route.name});
        setTabs(tabs => tabs.filter(tab => {if(tab.name != route.name){if(parseInt(tab.stepTitle.replace("Step ", "")) > parseInt(deleteItem.stepTitle.replace("Step ", ""))){tab.stepTitle = 'Step ' + (parseInt(tab.stepTitle.replace("Step ", "")) - 1);}     return tab;}}));
    }

    const addTab = () => {
        //console.log(tabs.pop().name.replace("Step ", ""));

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

    const finishRecipe = () => {
        const textArray = tabs.map(function(tab){ return tab.text; });
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
        console.log(tabs);
    }

    return (
        <StyledContainer>
            <InnerContainer>
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
            </InnerContainer>
        </StyledContainer> 
    )

}

export default CreateStep;