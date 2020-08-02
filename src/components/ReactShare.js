import React from 'react';

import {

  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton

} from "react-share";

import MetaTags from 'react-meta-tags';

export default function ReactShare(props) {

  let full_path = 'https://campuskost.se'; //+ props.location;
  let shareUrl = full_path; // 'https://campuskost.se/recipe/Bananbr%C3%B6d/Bananbr%C3%B6d-Sporkis';
  let title = 'Spana in det här receptet på Campuskost&description=Hey';

  console.log(shareUrl)

  return (
    <div>

    <FacebookShareButton
      url={shareUrl}
      quote={title}
      className="Demo__some-network__share-button"
      >
      <FacebookIcon size={32} round />
      </FacebookShareButton>

      <FacebookMessengerShareButton
        url={shareUrl}
        quote={title}
        className="Demo__some-network__share-button"
        >
        <FacebookIcon size={32} round />
        </FacebookMessengerShareButton>
    </div>
  );
}
