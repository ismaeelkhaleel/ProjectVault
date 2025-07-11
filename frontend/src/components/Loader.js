import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="ball" />
        <div className="ball" />
        <div className="ball" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.5s linear;
  }

  .ball {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    animation: bounce6135 1s alternate infinite;
    transition: 0.5s linear;
  }

  .ball {
    background: #fff;
  }

  .ball:nth-child(2) {
    animation-delay: 0.25s;
  }

  .ball:nth-child(3) {
    animation-delay: 0.5s;
  }

  @keyframes bounce6135 {
    from {
      transform: scale(2);
    }

    to {
      transform: scale(1);
    }
  }`;

export default Loader;