import React from 'react'
import Button from '@material-ui/core/Button'

const noop = () => {}

const FileInput = ({ value, uploadText, onChange = noop, ...rest }) => (
  <div>

    <label htmlFor='upload-photo'>
      <input
        {...rest}
        style={{ display: 'none' }}
        id='upload-photo'
        name='upload-photo'
        type='file'
        files={value}
        onChange={e => {
          onChange([...e.target.files])
        }}
      />

      <Button color='primary' variant='contained' component='span' style={{margin: '5px'}}>
      {uploadText}
      </Button>
    </label>

  </div>
)

export default FileInput
