import React, {useState} from 'react';

import {Colors} from '../../Constants/Colors';

import {Octicons, Ionicons, Foundation} from '@expo/vector-icons';


import {Text, View, Button, StyleSheet, Image, Animated} from 'react-native';

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
import TabIcon from '../TabIcon';

const Stack = createStackNavigator();

const StackCreate = createStackNavigator();

const StepTabs = createBottomTabNavigator();

const StepStack = () => {

    return (
        <tabContext.Consumer>
        {({tabs}) => (
        <StepTabs.Navigator
        screenOptions={{
            tabBarStyle: {
                position: 'absolute',
                borderRadius: 16,
                height: 60,
                bottom: 20,
                right: 30,
                left: 30,
            }
        }}  
        >
            {
                tabs.map((tab) => {
                return (<StepTabs.Screen 
                        key={tab.name} 
                        name={tab.name} 
                        stepTitle={tab.stepTitle} 
                        component={tab.component} 
                        initialParams={tab.initialParams}

                        options={{
                            tabBarLabel: `${tab.stepTitle}`,
                            headerTitle: `${tab.stepTitle}`,
                            headerTitleAlign: 'center',
                            tabBarIcon: () => (
                                <View />
                            ),
                        }}
                        />) })
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
        <StackCreate.Screen name="Create" component={Create}
        options={{
            headerTitle: "Create A Recipe",
            headerBackground: () => (<Image
            source={require('../../../assets/bluepoly.jpg')}
            style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
            resizeMode='cover'
            />),
        }}
        />
        <StackCreate.Screen name="CameraModal" component={CameraModal} 
        options={{
            headerTitle: "Select An Image",
            headerBackground: () => (<Image
            source={require('../../../assets/bluepoly.jpg')}
            style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
            resizeMode='cover'
            />),
        }}
        screenOptions={{
            presentation: 'modal' 
        }}/>
        <StackCreate.Screen name="IngredientStep" component={IngredientStep}
        options={{
            headerTitle: "List Ingredients",
            headerBackground: () => (<Image
            source={require('../../../assets/bluepoly.jpg')}
            style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
            resizeMode='cover'
            />),
        }}
        />
        <StackCreate.Screen name="Add Ingredient" component={ModalScreen} 
        options={{
            headerTitle: "Create Ingredient",
            headerBackground: () => (<Image
            source={require('../../../assets/bluepoly.jpg')}
            style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
            resizeMode='cover'
            />),
        }}
        screenOptions={{ presentation: 'modal' }}/>
        <StackCreate.Screen name="StepStack" component={StepStack}
        options={{
            headerTitle: "Steps",
            headerBackground: () => (<Image
            source={require('../../../assets/bluepoly.jpg')}
            style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
            resizeMode='cover'
            />),
        }}
        />
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
                >
                    {UserId ? (
                    <Stack.Group>
                    <Stack.Screen name="Home" component={Home}
                    options={{
                        headerShown: false
                    }}
                    />
                    <Stack.Screen name="Recipes" component={Recipes} 
                    options={{
                        headerTitle: "Your Recipes",
                        headerBackground: () => (<Image
                        source={require('../../../assets/bluepoly.jpg')}
                        style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
                        resizeMode='cover'
                        />),
                    }}
                    />
                    <Stack.Screen name="View Recipe" component={ViewRecipe} 
                    options={{
                        headerShown: false
                    }}
                    screenOptions={{ presentation: 'modal' }}/>
                    <Stack.Screen name="Import" component={ImportRecipe}
                    options={{
                        headerTitle: "Import Recipes",
                        headerBackground: () => (<Image
                        source={require('../../../assets/bluepoly.jpg')}
                        style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
                        resizeMode='cover'
                        />),
                    }}
                    />
                    <Stack.Screen name="Locate" component={Locate} 
                    options={{
                        headerTitle: "Locate Ingredients",
                        headerBackground: () => (<Image
                        source={require('../../../assets/bluepoly.jpg')}
                        style={{flex: 1, height: '100%', width: 900, position: 'absolute', left: 0, top: 0}}
                        resizeMode='cover'
                        />),
                    }}
                    />
                    <Stack.Screen name="CreateStack" component={CreateStack} 
                    options={{
                        headerShown: false
                    }}
                    />
                    <Stack.Screen name="Logout" component={Logout} 
                    options={{
                        headerShown: false
                    }}
                    />
                    </Stack.Group>
                    ) : (
                    <Stack.Group>
                    <Stack.Screen name="Login" component={Login}
                    options={{
                        headerShown: false
                    }}
                    />
                    <Stack.Screen name="Register" component={Register}
                    options={{
                        headerShown: false
                    }}
                    />
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