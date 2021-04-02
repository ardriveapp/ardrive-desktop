import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CreateUser, Sync, Wallet, WelcomeContainer } from 'app/components';

import { FirstStep, SecondStep, ThirdStep } from './steps';
import { authActions } from 'app/redux/slices/auth';

export default () => {
	const [step, setStep] = useState(0);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [walletPath, setWalletPath] = useState<string | undefined>();
	const [createNew, setCreateNew] = useState<boolean>(false);
	const dispatch = useDispatch();

	const firstStepCompleted = useCallback((username: string, password: string) => {
		setUsername(username);
		setPassword(password);
		setStep((prev) => prev + 1);
	}, []);

	const goNextStep = useCallback(() => {
		setStep((prev) => prev + 1);
	}, []);

	const secondtStepCompleted = useCallback(
		(createNew: boolean, walletPath?: string) => {
			setCreateNew(createNew);
			setWalletPath(walletPath);
			goNextStep();
		},
		[goNextStep]
	);

	const completeRegistration = useCallback(
		(syncFolderPath: string) => {
			if (username && password && syncFolderPath) {
				dispatch(
					authActions.createUser({
						username,
						password,
						syncFolderPath,
						createNew,
						walletPath
					})
				);
			}
		},
		[dispatch, username, password, createNew, walletPath]
	);

	const CurrentStep = useMemo(() => {
		switch (step) {
			case 0:
				return () => <FirstStep onContinue={firstStepCompleted} />;
			case 1:
				return () => <SecondStep onContinue={secondtStepCompleted} />;
			case 2:
				return () => <ThirdStep onContinue={completeRegistration} />;
			default:
				return React.Fragment;
		}
	}, [step, completeRegistration, firstStepCompleted, secondtStepCompleted]);

	const CurrentImage = useMemo(() => {
		switch (step) {
			case 0:
				return <CreateUser />;
			case 1:
				return <Wallet />;
			case 2:
				return <Sync />;
			default:
				return React.Fragment;
		}
	}, [step]);

	return (
		<WelcomeContainer rightImage={CurrentImage}>
			<CurrentStep />
		</WelcomeContainer>
	);
};
