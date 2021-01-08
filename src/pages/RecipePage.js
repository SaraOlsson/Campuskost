import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import React from 'react'
import { FadeIn } from "react-anim-kit"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { useHistory } from "react-router-dom"
import ListIngredients from '../components/recipe/ListIngredients'
import RecipeDecsList from '../components/recipe/RecipeDecsList'
import useRecipePage from '../components/recipe/useRecipePage'
import AlertDialog from '../components/shared/AlertDialog'
import generateTimeString from '../logic/generateTimeString'
import AddToList from '../components/lists/AddToList'
const fallbackImage = require('../assets/noconnection3.png')


export default function RecipePage(props) {

  // const { recipetitle } = useParams()

  const classes = useStyles()
  const history = useHistory()
  const {t} = useTranslation('common')

  const {
    recipe,
    email,
    ifUser,
    isLiking,
    likeRecipe,
    editRecipe,
    openAlert,
    setOpenAlert,
    onDeleteRecipeChoice
  } = useRecipePage()

  const icon = (isLiking() === true) ? <FavoriteIcon/> : <FavoriteBorderIcon/>;
  const timestring = recipe ? generateTimeString(recipe.timestamp) : undefined;
  const image = recipe ? <img src={recipe.img_url} className={classes.recipeImage} onError={(e)=>{e.target.onerror = null; e.target.src=fallbackImage}} alt={recipe.title}/> : null;

  return (!recipe) ? null : (

    <div>
      <div>

          <div className={classes.recipeheader}>

            
            <div>
              <span>
                { email && 
                  <Button disableTouchRipple onClick={likeRecipe}>{icon}</Button>
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

          <FadeIn up by={500}>
          { (recipe.servings || recipe.cookingtime) &&
            <div className={classes.timestamp}> 
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

          { recipe.freetext &&
          <div className={classes.freetext}> 
            <b>{recipe.user}</b> {recipe.freetext}
          </div>
          }
          
          { timestring && 
          <div className={classes.timestamp}> 
            {timestring}
          </div>
          }
          

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
   flexWrap: 'wrap'
  },
  freetext: {

    fontSize: 'small',
    borderRadius: '5px',
    padding: '10px 20px'
  },
  timestamp: {
    fontSize: 'x-small',
    padding: '10px 20px',
    color: 'gray'
  }
});

// 488 rows before refactor..
