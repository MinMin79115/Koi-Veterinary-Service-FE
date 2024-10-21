import React from 'react'
import { useLocation } from 'react-router-dom';

function useParam() {
    const location = useLocation();
    const getParam = (param) => {
        const data = new URLSearchParams(location.search);  
        return data.get(param);
    }
    return { getParam };
}

export default useParam