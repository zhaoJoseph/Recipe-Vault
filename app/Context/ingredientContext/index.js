import React, {createContext} from 'react';

export const ingredientContext = createContext({ingredientsList: {}, setIngredientsList: () => {}});