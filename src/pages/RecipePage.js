import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import React, { useEffect, useState } from 'react'
import { FadeIn } from "react-anim-kit"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import BouncyDiv from "../components/animations/BouncyDiv"
import Emoji from '../components/shared/Emoji'
import AddToList from '../components/lists/AddToList'
import ListIngredients from '../components/recipe/ListIngredients'
import RecipeDecsList from '../components/recipe/RecipeDecsList'
import useRecipePage from '../components/recipe/useRecipePage'
import AlertDialog from '../components/shared/AlertDialog'
import InfoGrid from '../components/recipe/InfoGrid'
import generateTimeString from '../logic/generateTimeString'
const fallbackImage = require('../assets/noconnection3.png')


const website_regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;

export default function RecipePage(props) {

  const [triggerLikeAnim, setTriggerLikeAnim] = useState(false)

  const classes = useStyles()
  const history = useHistory()
  const {t} = useTranslation('common')

  const {
    recipe,
    email,
    ifUser,
    likesBool,
    likeRecipe,
    editRecipe,
    openAlert,
    setOpenAlert,
    onDeleteRecipeChoice,
    liking_users
  } = useRecipePage()

  useEffect(() => {
    setTriggerLikeAnim(!triggerLikeAnim) // false or true doesn't matter
  }, [likesBool])

  const icon = likesBool ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  const timestring = recipe ? generateTimeString(recipe.timestamp) : undefined;
  const image = (recipe && recipe.img_url !== "") ? <img src={recipe.img_url} className={classes.recipeImage} onError={(e)=>{e.target.onerror = null; e.target.src=fallbackImage}} alt={recipe.title}/> : null;

  const regex_link = (recipe && recipe.credit_link ) ? recipe.credit_link.match(website_regex)[0] : "orginalrecept"

  // <div
  // style={{
  //   background: 'linear-gradient(87deg, #0081b3 0, #2dcecc 100%)',
  //   borderRadius: 5,
  //   minHeight: 100,
  //   display: 'flex',
  //   justifyContent: 'space-between'
  // }}>
  // </div> <InfoGrid/>

  const numLikes = () => {

    if(!liking_users)
      return -1

    return liking_users.docs.length
  }

  return (!recipe) ? null : (

    <div>
      <div>

          <div className={classes.recipeheader}>

            
            <div>
              <span>
                { email && 
                  <Button disableTouchRipple onClick={likeRecipe}>
                    <BouncyDiv trigger={triggerLikeAnim}> {icon} </BouncyDiv>
                  </Button>
                }
                {recipe.title + ' | '}
              </span>

              <span>
                <Button 
                  disableTouchRipple 
                  onClick={() => {history.push("/profile/" + recipe.user)}} >
                  { recipe.user }
                </Button>
              </span>
            </div>

            <AddToList recipe={recipe}/>

          </div>

          
          
          <FadeIn right by={300}>
          <div className={classes.recipeContainer}>
            {image}
          </div> 
          </FadeIn>

          

        {/* <div
        className={classes.grid}
        style={{
          background: 'linear-gradient(87deg, #0081b3 0, #2dcecc 100%)',
          borderRadius: 5,
          minHeight: 100,
          display: 'flex',
          justifyContent: 'space-between',
          padding: 30,
          marginTop: 20
        }}>

          <span> 1 </span>
          <span> 2 </span>
          <span> 3 </span>
          <span> 4 </span>

        </div>     */}
          

          <FadeIn up by={500}>

          <div
            style={{
              // background: 'linear-gradient(87deg, #0081b3 0, #2dcecc 100%)',
              background: 'whitesmoke',
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'space-between',
              padding: 30,
              marginTop: 20,
              flexFlow: 'wrap'
            }}
          >

          { recipe.freetext &&
          <div className={classes.freetext} style={{width: '100%'}}> 
            <b>{recipe.user}</b> <Emoji symbol="🗨️"/> {recipe.freetext}
          </div>
          }

          { timestring && 
          <div className={classes.timestamp}> 
            Uppladdat {timestring}
          </div>
          }

          {
            (numLikes() > 0) &&
            <div className={classes.freetext}> 
              <b>{numLikes()}</b> användare gillar detta recept
            </div>
          }


          { (recipe.servings || recipe.cookingtime) &&
            <div className={classes.freetext}> 
              { recipe.servings &&
              <span> 
                {recipe.servings} {t('recipe.servings')} {" | "}
              </span>
              }
              { recipe.cookingtime &&
              <span> 
                {t('recipe.cookingtime')}: {recipe.cookingtime} {t('recipe.minutes')}
              </span>
              }
            </div>
          }

          

          { recipe.credit_link &&
          <div className={classes.freetext}> 
            <b>Credit:</b> <a href={recipe.credit_link}> {regex_link}</a>
          </div>
          }
          
          

        </div>
          

        <ListIngredients ingredients={recipe.ingredients}/>
        <RecipeDecsList description={recipe.description}/>

        </FadeIn>

        {ifUser &&
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={editRecipe}
          >
            {t('recipe.edit_recipe')}
          </Button>
        }

        &nbsp; &nbsp; &nbsp;

        {ifUser &&
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={ () => setOpenAlert(true) }
          >
            {t('recipe.delete_recipe')}
          </Button>
        }

      </div>
      

      <AlertDialog
      open={openAlert}
      onAlertClose={onDeleteRecipeChoice}
      title="Är du säker?"
      message="Är du säker på att du vill ta bort det här receptet?"
      yesOptionText="Ja"
      NoOptionText="Oj, nej!"
      />

    </div>
  ); 
}

const useStyles = makeStyles({
  recipeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  recipeImage: {
    maxWidth: '90vw',
    height: '50vh',
    borderRadius: '5px',
    objectFit: 'cover',
  },
  recipeheader: {
   margin: '20px 0px',
   fontWeight: 'bold',
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   flexWrap: 'wrap',
   minHeight: 45
  },
  freetext: {

    fontSize: 'small',
    borderRadius: '5px',
    padding: '10px 20px'
  },
  timestamp: {
    fontSize: 'x-small',
    padding: '10px 20px',
    // color: 'gray'
  }
});

// 488 rows before refactor..
