import React from 'react'
import firebase from 'firebase/app'
import Button from '@material-ui/core/Button'

class City {

  name: string
  state: string 
  country: string
  residents: number
  tags: string[]

  constructor (name: string, state: string, country:string, residents:number, tags: string[]) {
      this.name = name
      this.state = state
      this.country = country
      this.residents = residents
      this.tags = tags
  }
  toString() {
      return this.name + ', ' + this.state + ', ' + this.country + ', ' + this.residents
  }
}

// Firestore data converter
var cityConverter = {
  toFirestore: function(city: City) {
      return {
          name: city.name,
          state: city.state,
          country: city.country,
          residents: city.residents,
          tags: city.tags
          };
  },
  fromFirestore: function(snapshot: any, options: any){
      const data = snapshot.data(options);
      return new City(data.name, data.state, data.country, data.residents, data.tags);
  }
};

const TestTS: React.FC = () => {

  const toSay = 'hello'

  var db = firebase.firestore()

    const onClick = () => {
        // Set with cityConverter
        db.collection("cities").doc("LND")
        .withConverter(cityConverter)
        .set(new City("Tillberga", "CA", "SE", 1588, ["bigcity", "island"]));

        console.log("object uploaded")
    }

    const onGetClick = () => {
      
      db.collection("cities").doc("LND")
      .withConverter(cityConverter)
      .get().then((doc) => {
        if (doc.exists){
          // Convert to City object
          var city = doc.data();
          // Use a City instance method
          if(city)
            console.log(city.toString());
        } else {
          console.log("No such document!");
        }}).catch((error) => {
          console.log("Error getting document:", error);
        });
      
    }
    
  return (
  <>
    <Button
          variant='contained'
          color='primary'
          onClick={onClick}
        >
          Ladda upp
    </Button>
    <Button
          variant='contained'
          color='primary'
          onClick={onGetClick}
        >
          Hämta
    </Button>
  </> 
  )
}

export default TestTS