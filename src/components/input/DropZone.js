import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { useSelector } from 'react-redux'
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase'
import Dropzone from 'react-dropzone'

// Path within Database for metadata (also used for file Storage path)
const filesPath = 'uploadedFiles'

export default function Uploader() { // { uploadedFiles, onFileDelete, onFilesDrop }
  const firebase = useFirebase()
  const uploadedFiles = useSelector(({ firebase: { data } }) => data[filesPath])

  function onFilesDrop(files) {
    return firebase.uploadFiles(filesPath, files, filesPath)
  }
  function onFileDelete(file, key) {
    return firebase.deleteFile(file.fullPath, `${filesPath}/${key}`)
  }

  return (
    <div>
      <Dropzone onDrop={onFilesDrop}>
        <div>Drag and drop files here or click to select</div>
      </Dropzone>
      {uploadedFiles && (
        <div>
          <h3>Uploaded file(s):</h3>
          {map(uploadedFiles, (file, key) => (
            <div key={file.name + key}>
              <span>{file.name}</span>
              <button onClick={() => onFileDelete(file, key)}>
                Delete File
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}