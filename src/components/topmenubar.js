import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import LinkUI from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { default as AccountCircle, default as AccountCircleIcon } from '@material-ui/icons/AccountCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

function TopMenuBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const history = useHistory();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchFocus = () => {
    if(history.location.pathname !== "/search")
      history.push("/search")
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>

          <div className={classes.sectionMobile}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={ () => history.goBack() }
            >
              <ArrowBackIosIcon />
            </IconButton>
          </div>

          <Typography className={classes.title} variant="h6" noWrap>

            <LinkUI component={Link} to="/home" style={{ textDecoration: 'none', color: 'white' }}>
              Campuskost
            </LinkUI>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onBlur={() => console.log("onBlur")}
              onFocus={() => handleSearchFocus()}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          <ProfileBtn signedIn={props.signedIn} handleChange={props.handleChange}/>
          </div>

          <div className={classes.sectionMobile}>
          <ProfileBtn signedIn={props.signedIn} handleChange={props.handleChange}/>
          </div>

        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}


function ProfileBtn (props) {

  const classes = useStyles();
  const history = useHistory();
  const store = useSelector(state => state.fireReducer);

  let btn = (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/login")}
        className={classes.buttonPad}
      >
        logga in
      </Button>
    </div> );

  // make sure info is loaded
  let img_src = (store.firestore_user && store.firestore_user.profile_img_url ) ? store.firestore_user.profile_img_url : undefined;

  // if user has no profile image set in firebase
  /*
  if (img_src === undefined) {
    img_src = <AccountCircleIcon/>;
  } */

  let icon_content = (img_src !== undefined) ? <img src={img_src} className={classes.smallprofileimage} alt={"profile img"} /> : <AccountCircleIcon/>;

  let jsx_content = props.signedIn ? icon_content : btn;

  if(props.signedIn === true && store.firestore_user)
  {
    return (
      <React.Fragment>
      <p style={{marginRight: 15, color: 'rgba(255,255,255,0.5)'}}> {store.firestore_user.username} </p>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open profile"
        onClick={() => history.push("/profile/" + store.firestore_user.username)}
      >
      {jsx_content} </IconButton></React.Fragment>

    );
  } else {
    return btn;
  }

}

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    //marginBottom: '50px'
  },
  menuButton: {
    marginRight: 0, // theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  whiteColor: {
    color: 'white'
  },
  buttonPad: {
    padding: '6px',
    fontSize: 'small'
  },
  smallprofileimage: {
    width: '40px'
  }
}));

export default TopMenuBar;
