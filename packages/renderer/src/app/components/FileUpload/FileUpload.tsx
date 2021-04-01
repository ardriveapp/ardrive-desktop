import React, { useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AddContentImage } from "app/components/tables/FileList/FileList.styled";
import {
	FileUploadContainer,
	FormField,
} from "./FileUpload.styled";
import { appActions } from "app/redux/slices/app";
import { authActions } from 'app/redux/slices/auth';
import { authSelectors } from 'app/redux/selectors';

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;

const FileUpload: React.FC<{
	updateFilesCb(filesArray: any[]): void;
	multiple: boolean;
	maxFileSizeInBytes?: number;
}> = ({
	updateFilesCb,
	maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
	...otherProps
}) => {
		const fileInputField = useRef(null);
		const dispatch = useDispatch();
		const user = useSelector(authSelectors.getUser);
		const readFileAsDataURL = async (file: File) => {
			const result = await new Promise((resolve) => {
				const fileReader = new FileReader();
				fileReader.onload = (e) => resolve(fileReader.result);
				fileReader.readAsDataURL(file);
			});

			return result;
		}
		const handleNewFileUpload = async (e: any) => {
			const { files: newFiles } = e.target;
			if (newFiles.length === 0) return;
			let filesContent = [];
			for (const file of newFiles) {
				filesContent.push(await readFileAsDataURL(file));
			}
			if (user != null) {
				// dispatch(appActions.uploadFile({ ...user, filesContent, newFiles }))
				dispatch(appActions.uploadFile(newFiles))
			}
		};
		return (
			<>
				<FileUploadContainer>
					<FormField
						type="file"
						ref={fileInputField}
						onChange={handleNewFileUpload}
						{...otherProps}
					/>
					<AddContentImage />
				</FileUploadContainer>
			</>
		);
	}

export default FileUpload;
