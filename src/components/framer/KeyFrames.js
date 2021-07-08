import { motion } from 'framer-motion'
import React from 'react'
import Button from '@material-ui/core/Button'

// const KeyFrames = () => (
//   <motion.div
//     animate={{
//       scale: [1, 2, 2, 1, 1],
//       rotate: [0, 0, 270, 270, 0],
//       borderRadius: ['20%', '20%', '50%', '50%', '20%'],
//     }}
//   > HEJ </motion.div>
// )


const KeyFrames = () => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
  <Button variant='contained' color='primary'>
      Klicka mig 
  </Button>
  </motion.button>
)

export default KeyFrames