import React, {createContext} from 'react';

export const recipeContext = createContext({recipe: {}, setRecipe: () => {}});