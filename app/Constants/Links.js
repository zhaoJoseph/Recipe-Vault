import React from 'react';

const base = __DEV__  ? 'http://192.168.1.145:3000' : "https://foodprojectapi-vs7cd2fg5a-uc.a.run.app";

export const Links = {
    recipe: `${base}/recipe`,
    user: `${base}/user`,
    recipesList: `${base}/recipesList`,
    listSearch: `${base}/recipesList/search`,
    accesscode: `${base}/oauth/accesscode`,
    token: `${base}/oauth/token`,
    refresh: `${base}/oauth/refresh`,
    locations: `${base}/locations`,
    url: `${base}/url`,
};