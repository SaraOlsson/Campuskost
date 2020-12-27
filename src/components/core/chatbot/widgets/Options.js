import React from "react"
import { makeStyles } from '@material-ui/core/styles'

function Options({ options }) {

  const classes = useStyles()

  const markup = options.map((option) => (
    <button key={option.id} className={classes.option} onClick={option.handler}>
      {option.displayName}
    </button>
  ))

  return <div className={classes.options}>{markup}</div>;
}

const useStyles = makeStyles({
    options: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '10px',
    },
    option: {
        borderRadius: '25px',
        padding: '8px',
        border: '1px solid #173e3f', // 'none', // 
        color: '#1d1d1d',
        fontSize: '0.8rem',
        margin: '4px 4px',
        background: 'transparent', // '#68bb8c',
        outline: 'none'
    }
})

export default Options