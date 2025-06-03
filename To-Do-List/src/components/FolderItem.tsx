// src/components/FolderItem.tsx
import React from 'react';
import type { Folder } from '../types'; 

interface FolderItemProps {
  folder: Folder;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder }) => {
  return (
    <li 
      className="p-3 mb-2 bg-sky-50 hover:bg-sky-100 rounded shadow-sm border border-sky-200 cursor-pointer"
    >
      {folder.name}
    </li>
  );
};

export default FolderItem;