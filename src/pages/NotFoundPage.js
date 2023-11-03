import { Button } from 'components/button';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundPageStyles = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .logo192 {
        display: inline-block;
        margin-bottom: 40px;
    }

    .heading {
        font-size: 36px;
        margin: 36px;
    }

    .back-button {
        font-weight: 500;
    }
`;

const NotFoundPage = () => {
    return (
        <NotFoundPageStyles>
            <img srcSet="/404.png 2x" alt="monkey-blog" />

            <h1 className="heading">Oops! Page not found</h1>
            <NavLink to="/" className={'back-button'}>
                <Button>Back to Home</Button>
            </NavLink>
        </NotFoundPageStyles>
    );
};

export default NotFoundPage;
