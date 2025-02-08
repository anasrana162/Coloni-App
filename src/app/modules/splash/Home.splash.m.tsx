import React from 'react';
import BottomTab from '../../routes/bottom-tab/BottomTab.app.component';
import useHome from './hooks/useHome.hook';

const Home = () => {
  const {} = useHome();
  return <BottomTab />;
};

export default Home;
