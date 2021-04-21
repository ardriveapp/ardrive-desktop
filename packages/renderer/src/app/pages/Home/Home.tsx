import React from 'react';

import { MainContainer } from 'app/components';

const Home: React.FC<{
	subroutes: JSX.Element;
}> = ({ subroutes }) => {
	return <MainContainer>{subroutes}</MainContainer>;
};

export default Home;
