import React, { useEffect, useState } from "react";

import { DetailsSidebar, FileList, MoveToModal } from "app/components";

import { PageContentContainer, PageContainer } from "./PrivateDrive.styled";
import { useDispatch, useSelector } from "react-redux";
import { appSelectors, authSelectors } from "app/redux/selectors";
import { appActions } from "app/redux/slices/app";
import { ArDriveFile } from "app/redux/types";

export default () => {
  const [selectedItem, setSelectedItem] = useState<ArDriveFile | null>(null);
  const [clickedItem, setClickedItem] = useState<ArDriveFile | null>(null);
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const dispatch = useDispatch();
  const files = useSelector(appSelectors.getFiles);
  const user = useSelector(authSelectors.getUser);

  useEffect(() => {
    if (user != null) {
      dispatch(appActions.fetchFiles(user.login));
    }
  }, [user]);

  return (
    <PageContainer>
      <PageContentContainer>
        <FileList
          hideHeader
          hideOptions
          items={files}
          onSelect={setSelectedItem}
          onItemClick={setClickedItem}
          activeItem={clickedItem}
        />
      </PageContentContainer>
      <DetailsSidebar
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
      <MoveToModal
        visible={showMoveToModal}
        onClose={() => setShowMoveToModal(false)}
      />
    </PageContainer>
  );
};
