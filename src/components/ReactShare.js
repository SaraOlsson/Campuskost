import React from 'react';
import { FacebookIcon, FacebookShareButton } from "react-share";

export default function ReactShare(props) {

  let full_path = 'https://campuskost.se/#' + props.location;
  let shareUrl = full_path; // 'https://campuskost.se/recipe/Bananbr%C3%B6d/Bananbr%C3%B6d-Sporkis';
  let title = 'Spana in det här receptet på Campuskost! Låter gott med ' + props.title;

  console.log(shareUrl)

  return (

      <FacebookShareButton
        url={shareUrl}
        quote={title}
        className="Demo__some-network__share-button"
        >

        <div style={{marginTop: 10}}>
          
            <FacebookIcon size={32} round />
          
        </div>

        </FacebookShareButton>

  );
}

/*

<FacebookMessengerShareButton
  url={shareUrl}
  quote={title}
  className="Demo__some-network__share-button"
  >
  <FacebookIcon size={32} round />
  </FacebookMessengerShareButton>

*/
