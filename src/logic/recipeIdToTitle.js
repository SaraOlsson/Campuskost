// NEEDS REWRITE AS RECIPE ID IS NOT TITLE
const recipe_id_to_title = (recipe_id) => {
    let recipe_title = recipe_id.substring(0, recipe_id.indexOf('-'));
    return recipe_title;
  }

export default recipe_id_to_title