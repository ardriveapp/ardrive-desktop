import React, { useRef } from "react";
import { useDispatch } from 'react-redux';
import { AddContentImage } from "app/components/tables/FileList/FileList.styled";
import {
	FileUploadContainer,
	FormField,
} from "./FileUpload.styled";
import { appActions } from "app/redux/slices/app";

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
		const handleNewFileUpload = (e: any) => {
			const { files: newFiles } = e.target;
			if (newFiles.length === 0) return;
			dispatch(appActions.uploadFile(e.target.files))
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
