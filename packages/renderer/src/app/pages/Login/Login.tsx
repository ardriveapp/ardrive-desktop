import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { AppTextLogo, Login, WelcomeContainer } from "app/components";
import { useTranslationAt } from "app/utils/hooks";

import {
	UnlockButton,
	SetupNewUserButton,
	NeedHelpButton,
	LoginFormContainer,
	AgreePolicyCheckBox,
	AgreeText,
	PolicyContainer,
	UsageLink
} from "./Login.styled";
import { ArdriveInput } from "app/components/inputs/ArdriveInput";
import { ArdriveHeader } from "app/components/typography/Headers.styled";
import { authActions } from "app/redux/slices/auth";
import { appActions } from "app/redux/slices/app";

export default () => {
	const { t } = useTranslationAt("pages.login");
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const history = useHistory();
	const [agreeStatus, setAgree] = useState(false);

	const login = useCallback(() => {
		if (!agreeStatus) {
			alert(t("agree_warning"));
			return
		}
		dispatch(
			authActions.login({
				login: username,
				password,
			})
		);
	}, [dispatch, username, password, t, agreeStatus]);

	const setField = useCallback((setFunction: any) => {
		return (event: any) => {
			setFunction(event.currentTarget.value);
		};
	}, []);

	const createNewUser = useCallback(() => {
		history.push("/create-user");
	}, [history]);

	return (
		<WelcomeContainer rightImage={<Login />}>
			<ArdriveHeader>{t("login")}</ArdriveHeader>
			<AppTextLogo />
			<LoginFormContainer>
				<ArdriveInput
					placeholder={t("username")}
					onChange={setField(setUsername)}
				/>
				<ArdriveInput
					type="password"
					placeholder={t("password")}
					onChange={setField(setPassword)}
				/>
				<PolicyContainer>
					<AgreePolicyCheckBox type="checkbox" onChange={() => setAgree(!agreeStatus)} />
					<div>
						<AgreeText>{t("agree_text")}</AgreeText>
						<UsageLink onClick={() => dispatch(appActions.openUsageLink())}>{t("usage_policy")}</UsageLink>
					</div>
				</PolicyContainer>
				<UnlockButton onClick={login}>{t("unlock_button")}</UnlockButton>
			</LoginFormContainer>
			<SetupNewUserButton onClick={createNewUser}>
				{t("setup_new_user")}
			</SetupNewUserButton>
			<NeedHelpButton>{t("need_help")}</NeedHelpButton>
		</WelcomeContainer>
	);
};
