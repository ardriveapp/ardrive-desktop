import React, { useContext } from "react";

export type ModalType = "new_drive" | "attach_drive" | "login";

interface ModalContext {
	modalVisible: boolean;
	modalType?: ModalType;
	showModal(type: ModalType): void;
	hideModal(): void;
}

export const AppModalContext = React.createContext<ModalContext>({
	modalVisible: false,
	showModal: () => { },
	hideModal: () => { },
});

export const useModal = () => {
	const modalContext = useContext(AppModalContext);

	return {
		showModal: modalContext.showModal,
		hideModal: modalContext.hideModal,
		modalType: modalContext.modalType,
		modalVisible: modalContext.modalVisible,
	};
};
