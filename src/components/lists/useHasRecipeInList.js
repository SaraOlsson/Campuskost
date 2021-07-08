import { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import firebase from 'firebase/app'


function useHasRecipeInList(ref_user, ref_recipe) {

    const [hasRecipe, setHasRecipe] = useState(false)
    const db = firebase.firestore()

    const [lists, loading, error] = useCollection(
        db.collection('lists').where('created_by', '==', ref_user)
    )

    // const [lists, loading, error] = useCollection(
    //     db.collectionGroup('lists').where('created_by', '==', ref_user)
    // )

    // const [lists, loading, error] = useCollection(
    //     db.collection('lists').where('created_by', '==', ref_user).collection('recipes').where('recipeID', '==', ref_recipe)
    // )

    // .where('songName', 'array-contains', 'Title1')

    // const [savedDoc] = useDocument(
    //     db.collection('lists').doc(list.listID).collection('recipes').doc(ref_recipe)
    // )

    useEffect(() => {

        console.log(lists)

        if(!lists || lists.docs.length < 1)
            return

        lists.docs.map( l => {
            console.log(l)
        })

    }, [lists])

    
    return {hasRecipe}

}

export default useHasRecipeInList