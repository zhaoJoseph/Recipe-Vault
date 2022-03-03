import React, {createContext} from 'react';

export const userContext = createContext({UserId: {}, setUserId: () => {}});