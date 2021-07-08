
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'

function useDataLoad(userEmail) {

    useFirestoreConnect({
        collection: `users`,
        doc: userEmail,
        storeAs: 'userdoc',
    })

    useFirestoreConnect({
        collection: `users`,
        storeAs: 'allusers',
    })
    
    useFirestoreConnect({
        collection: `recipes`,
        storeAs: 'allrecipes',
    })
    
    // useFirestoreConnect({
    //     collection: `recipe_likes`,
    //     doc:  `${userEmail}`,
    //     storeAs: 'userLikes',
    // })
    
    useFirestoreConnect([
    {
        collection: `followers/${userEmail}/following`,
        storeAs: 'following',
    },
    {
        collection: `followers/${userEmail}/followers`,
        storeAs: 'followers',
    }
    ])
      
}

export default useDataLoad