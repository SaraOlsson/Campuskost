import React from 'react';
import Options from "./Options"

export function StartOptions(props) {

  const options = [
    {
        name: "infoabout",
        displayName: "Om Campuskost",
        handler: props.actionProvider.handleAboutDocs,
        id: 1,
    },
    {
        name: "infoupload",
        displayName: "Ladda upp recept",
        handler: props.actionProvider.handleUploadDocs,
        id: 2,
    }
  ];

  return (

      <Options options={options}/>

  );
}

