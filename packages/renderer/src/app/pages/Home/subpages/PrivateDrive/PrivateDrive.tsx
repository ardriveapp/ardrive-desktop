import React, { useEffect, useState } from "react";

import {
  DetailsSidebar,
  FileList,
  FileListItem,
  MoveToModal,
} from "app/components";

import { PageContentContainer, PageContainer } from "./PrivateDrive.styled";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "app/redux/actions";
import { appSelectors } from "app/redux/selectors";

// TODO: remove
const testItems: FileListItem[] = [
  {
    name: "Test item",
    modifiedDate: new Date(),
    size: 1,
    type: "folder",
  },
  {
    name: "Test item 2",
    modifiedDate: new Date("01.10.2010"),
    size: 1,
    type: "file",
  },
];

export default () => {
  const [selectedItem, setSelectedItem] = useState<FileListItem | null>(null);
  const [clickedItem, setClickedItem] = useState<FileListItem | null>(null);
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const dispatch = useDispatch();
  const files = useSelector(appSelectors.getFiles);

  useEffect(() => {
    dispatch(appActions.fetchFiles());
  }, []);

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
