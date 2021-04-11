
import React from 'react'
import Button from '@material-ui/core/Button'
import firebase from 'firebase/app'

class City {
    constructor (name, state, country ) {
        this.name = name;
        this.state = state;
        this.country = country;
    }
    toString() {
        return this.name + ', ' + this.state + ', ' + this.country;
    }
}

// Firestore data converter
var cityConverter = {
    toFirestore: function(city) {
        return {
            name: city.name,
            state: city.state,
            country: city.country
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new City(data.name, data.state, data.country);
    }
};

export default function CustomUpload() {

    var db = firebase.firestore()

    const onClick = () => {
        // Set with cityConverter
        db.collection("cities").doc("LA")
        .withConverter(cityConverter)
        .set(new City("Los Angeles", "CA", "USA"));

        console.log("object uploaded")
    }

    return (
  
        <Button
          variant='contained'
          color='primary'
          onClick={onClick}
        >
          Ladda upp objekt
        </Button>

    )
  }




