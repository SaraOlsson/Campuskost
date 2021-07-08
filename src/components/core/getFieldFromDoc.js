

// async function getFieldFromDoc(db_Ref, fieldName) {

//      let found = false
//      let docData = {}
//      let field = 'undefined'


//     await db_Ref.get().then( async function(doc) {

//         if (doc.exists) {

//             docData = doc.data()
    
//             if (docData[fieldName]) {
                
//                 field = docData[fieldName]
//                 found = true
//                 console.log('found doc')
//                 return {found, docData, field}
//             }
//             else {
//                 return {found, docData, field}
//             }
    
//         } else {
            
//             found = false
//             console.log('does not exist')
//             return {found, docData, field}
//         }

//         })
//         .catch(err => {
        
//             found = false
//             console.log(err)
//             return {found, docData, field}
        
//     });
    
//     console.log('exit')

    
// }

// export default getFieldFromDoc