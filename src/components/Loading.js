import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components'
 
const Loading = ({ type, color }) => (
    <LoadingWrapper>
        <ReactLoading type={type} color={color} height={'3%'} width={'70px'} />
    </LoadingWrapper>
    
);
 
const LoadingWrapper = styled.div`
    position: absolute;
    top: 0%;
    bottom: 0%;
    left: 0%;
    right: 0%;
    background: rgba(255,255,255,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999999999;
`

export default Loading;