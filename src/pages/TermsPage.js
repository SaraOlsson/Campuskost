import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

function TermsPage() {

    const classes = useStyles()

    return(

        <div className={classes.infoContainer}>
            <h3>Vilkor och information</h3>
            <p className={classes.infoText}>
                När du skapar ett konto på Campuskost sköts dina inloggningsuppgifter av Firebase Authentication API.
                Cookies sparas för att skapa en bra upplevelse och låta dig använda Campuskost offline.
                <br/><br/>
                Campuskost är gratis att använda. Reklam eller sammarbeten med företag kan förekomma i framtiden.
            </p>
        </div>
    );
}

const useStyles = makeStyles({
    infoContainer: {
        padding: '15px'
    },
    infoText: {
        fontSize: 'small'
    }
});

export default TermsPage