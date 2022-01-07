import { useEffect, useState, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export const Button = styled.span<{ reversed: boolean; active: boolean }>`
  ${({ active, reversed }) => css`
    cursor: pointer;
    color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
  `}
`;

export const Icon = styled.span`
  font-size: 18px;
  vertical-align: text-bottom; ;
`;

export const Instruction = styled.div`
  white-space: pre-wrap;
  margin: 0 -20px 10px;
  padding: 10px 20px;
  font-size: 14px;
  background: #f8f8e8;
`;

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }

  & > * + * {
    margin-left: 15px;
  }

  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
`;

export const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return <>{children}</>;
};

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 100px;
`;
