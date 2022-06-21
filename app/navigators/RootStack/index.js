import React, {useState} from 'react';

 import {Colors} from '../../Constants/Colors';

import {Text, View, Button} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {userContext} from '../../Context/userContext';

import { ingredientContext } from '../../Context/ingredientContext';
import { tabContext } from '../../Context/tabContext';
import {recipeContext} from '../../Context/recipeContext';

import Login from '../../screens/Login';
import Register from '../../screens/Register';
import Home from '../../screens/Home';
import Recipes from '../../screens/Recipes';
import Create from '../../screens/Create';
import CreateStep from '../../screens/CreateStep';
import IngredientStep from '../../screens/IngredientStep';
import ModalScreen from '../../screens/ModalScreen';
import ViewRecipe from '../../screens/ViewRecipe';
import ImportRecipe from '../../screens/ImportRecipe';
import Locate from '../../screens/Locate';
import Logout from '../../screens/Logout';
import CameraModal from '../../screens/CameraModal';

const Stack = createStackNavigator();

const StackCreate = createStackNavigator();

const StepTabs = createBottomTabNavigator();

const StepStack = () => {

    return (
        <tabContext.Consumer>
        {({tabs}) => (
        <StepTabs.Navigator
        screenOptions={{
        tabBarHideOnKeyboard: true
        }}  
        >
            {
                tabs.map((tab) => <StepTabs.Screen key={tab.name} name={tab.name} stepTitle={tab.stepTitle} component={tab.component} initialParams={tab.initialParams}
                options={{
                    tabBarLabel: `${tab.stepTitle}`,
                    headerTitle: `${tab.stepTitle}`,
                }}
                /> )
            }
        </StepTabs.Navigator>
        )}
        </tabContext.Consumer>
    )
}

const CreateStack = () => {

    const [tabs, setTabs] = useState([
    {
        name: 'Step 1',
        stepTitle: 'Step 1',
        component: CreateStep,
        initialParams: {},
        text: '',
    }
    ]
    );
    const [ingredientsList, setIngredientsList] = useState([]);
    const [recipe, setRecipe] = useState({});

    return (
        <recipeContext.Provider value={{recipe, setRecipe}} >
        <ingredientContext.Provider value={{ingredientsList, setIngredientsList}}>
        <tabContext.Provider value={{tabs, setTabs}}>
        <StackCreate.Navigator>   
        <StackCreate.Screen name="Create" component={Create}/>
        <StackCreate.Screen name="CameraModal" component={CameraModal} 
        screenOptions={{presentation: 'modal' }}/>
        <StackCreate.Screen name="IngredientStep" component={IngredientStep}/>
        <StackCreate.Screen name="Add Ingredient" component={ModalScreen} 
        screenOptions={{ presentation: 'modal' }}/>
        <StackCreate.Screen name="StepStack" component={StepStack}/>
        </StackCreate.Navigator>
        </tabContext.Provider>
        </ingredientContext.Provider>
        </recipeContext.Provider>

    )
}

const RootStack =() => {

    return (
        <userContext.Consumer>
            {({UserId, loading}) => (            
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: "transparent",
                        },
                        headerShown: false,
                        headerTintColor: Colors.tertiary,
                        headerTransparent: true,
                        headerTitle: '',
                        headerLeftContainerStyle: {
                            paddingLeft: 20,
                        }
                    }}
                >
                    {UserId ? (
                    <Stack.Group>
                    <Stack.Screen name="Home" component={Home}/>
                    <Stack.Screen name="Recipes" component={Recipes} />
                    <Stack.Screen name="View Recipe" component={ViewRecipe} 
                    screenOptions={{ presentation: 'modal' }}/>
                    <Stack.Screen name="Import" component={ImportRecipe} />
                    <Stack.Screen name="Locate" component={Locate} />
                    <Stack.Screen name="CreateStack" component={CreateStack} />
                    <Stack.Screen name="Logout" component={Logout} />
                    </Stack.Group>
                    ) : (
                    <Stack.Group>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    </Stack.Group>
                    )}
                </Stack.Navigator> 
            </NavigationContainer>
            )
            }   
        </userContext.Consumer>
    );

}

export default RootStack;