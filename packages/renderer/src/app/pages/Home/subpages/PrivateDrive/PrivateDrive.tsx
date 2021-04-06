import React, { useEffect, useState } from "react";

import { FileList } from "app/components";

import { PageContentContainer, PageContainer } from "./PrivateDrive.styled";
import { useDispatch, useSelector } from "react-redux";
import { appSelectors, authSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/slices/app";
import { ArDriveFile } from "app/redux/types";

export default () => {
	const [clickedItem, setClickedItem] = useState<ArDriveFile | null>(null);
	const dispatch = useDispatch();
	const files = useSelector(appSelectors.getFiles);
	const user = useSelector(authSelectors.getUser);
	useEffect(() => {
		if (user != null) {
			dispatch(appActions.fetchFiles(user.login));
		}
	}, [user, dispatch]);

	return (
		<PageContainer>
			<PageContentContainer>
				<FileList
					hideHeader
					items={files}
					onItemClick={setClickedItem}
					activeItem={clickedItem}
				/>
			</PageContentContainer>
		</PageContainer>
	);
};
