import styled from 'styled-components';
import type { NextPage } from 'next';

import Editor from './components/Editor/Editor';

const Container = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home: NextPage = () => {
  return <Editor />;
};

export default Home;
