import React from "react";

const noop = () => {};

const FileInput = ({ value, onChange = noop, ...rest }) => (
  <div>
    {Boolean(value.length) && (
      <div>Selected files: {value.map(f => f.name).join(", ")}</div>
    )}
    <label style={{

      padding: '6px 16px',
      fontSize: '0.875rem',
      minWidth: '64px',
      boxSizing: 'border-box',
      transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: '500',
      lineHeight: '1.75',
      borderRadius: '4px',
      letterSpacing: '0.02857em',
      backgroundColor: '#3f51b5',
      color: 'white',
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'

    }}>

     Välj bild

      <input
        {...rest}
        style={{ display: "none" }}
        type="file"
        onChange={e => {
          onChange([...e.target.files]);
        }}
      />
    </label>
  </div>
);

/*

<Button
  variant="contained"
  color="primary"
  startIcon={<PhotoCamera />}
  style={{ textTransform: 'unset' }}
>
  Välj bild
</Button>

*/

export default FileInput;
