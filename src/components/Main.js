import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToTopButton from './ToTopButton';

const Wrapper = styled('main')`
  position: relative;
  padding-top: 80px;
  .buit{
    position:fixed;
    bottom: 5%;;
  }
  box-sizing: border-box;
`;

const Main = ({ children, className }) => (
  <Wrapper role="main" id="content" className={className}>
    {children}
    <ToTopButton className="buit" />
  </Wrapper>
);

Main.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Main.defaultProps = {
  className: '',
};

export default Main;
