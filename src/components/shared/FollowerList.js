import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person'
import React, { useEffect, useState } from 'react'
import Emoji from './Emoji'
import { useHistory } from 'react-router-dom'
import {FadeIn} from 'react-anim-kit'

function FollowerListItem(props) {

  const classes = useStyles()
  let user = props.user

  let user_avatar = undefined
  if(user.profile_img_url !== undefined && user.profile_img_url !== '') {
    user_avatar = <img src={user.profile_img_url} className={classes.smallprofileimage} alt={'profile-img'} /> //
  } else {
    user_avatar = (
      <Avatar className={classes.avatar}>
          <PersonIcon/>
      </Avatar>
    )
  }

  return (

    <ListItem className={classes.pointer + ' ' + classes.mylistitem}>
      <ListItemAvatar>
        {user_avatar}
      </ListItemAvatar>

      <ListItemText
        primary= { user.username }
        secondary={ user.fullname }
        onClick={() => props.handleChange(user.username)}
      />
    </ListItem>

  )
}

function FollowerList(props) {

  const [followData, setFollowData] = useState([])
  const classes = useStyles()
  const history = useHistory()

  const handleUserClick = (user) => {
    history.push('/profile/' + user )
  }

  // when url changes, on load and on user click
  useEffect(() => {

    setFollowData(props.followerData)

  }, [props.followerData])


  if (props.followerData.length < 1) {

    if(props.type === 'followers') 
      return <div className={classes.followerlist + ' ' + classes.noFollowDiv}> Alla har vi en gång varit utan följare.. <Emoji symbol='💌'/> </div>
    else if(props.type === 'following')
      return <div className={classes.followerlist + ' ' + classes.noFollowDiv}> Här följs det ingen än.. <Emoji symbol='🚶'/> </div>
  }

  let followersjsx = followData.map((user, idx) =>
    <FollowerListItem key={idx} user={user} handleChange={handleUserClick} showFollowIcon={props.showFollowIcon}/>
  )

  return (
    <FadeIn up by={200}>
    <List dense={true} className={classes.followerlist}>
      {followersjsx}
    </List>
    </FadeIn>
  )
}

const useStyles = makeStyles(theme => ({
  followerlist: {
   marginTop: '15px',
   },
   followColor: {
     color: '#39A4B3'
   },
   notfollowColor: {
     color: '#e8e8e8'
   },
   smallprofileimage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '100px',
    margin: '5px auto'
   },
   avatar: {
    marginBottom: '15px',
    color: '#fafafa',
    backgroundColor: theme.palette.campuskost.teal
   },
   pointer: {
    cursor: 'pointer'
   },
   mylistitem: {
    alignItems: 'end'
   },
   noFollowDiv: {
    padding: '1rem',
    fontSize: 'small'
   }
}))

export default FollowerList
