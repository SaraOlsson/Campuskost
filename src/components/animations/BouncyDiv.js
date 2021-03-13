import { bounce, pulse, tada } from 'react-animations';
import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect, useState} from "react"

function BouncyDiv(props) {

  const classes = useStyles()
  const [animNow, setAnimNow] = useState(false)


  useEffect(() => {

    setAnimNow(true)
    
    const timer =  setTimeout(() => {
      setAnimNow(false)
    }, 2000);

    return () => clearTimeout(timer);

  }, [props.trigger])

  return (
  <>
    {/* <button onClick={triggerAnim}>Trigger animation</button> */}
    <div className={animNow ? classes.anim : ""}>
      {props.children}
    </div>
  </>
  )
}

const useStyles = makeStyles(theme => ({
  '@keyframes bounce': tada,
  anim: {
    animation: '$bounce 2000ms', // infinite
    width: 24,
    height: 24
  }
}))

export default BouncyDiv

// const triggerAnim = () => {
//   console.log("animate now")
//   setAnimNow(true)

//   setTimeout(() => {
//     setAnimNow(false)
//   }, 2000);
// }