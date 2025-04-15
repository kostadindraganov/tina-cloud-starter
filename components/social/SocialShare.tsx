"use client"

import React, { useState, useEffect } from 'react'
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from 'next-share'

interface SocialShareProps {
  url: string
  title: string
  className?: string
  iconSize?: number
  round?: boolean,
  hashtag?: string,
  quote?: string
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  className = '',
  iconSize = 32,
  round = true,
  hashtag = '#GMBL',
  quote = 'Discover top-rated crypto and sweepstakes casinos with expert reviews and exclusive bonuses.'
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side placeholder
    return <div className={`flex space-x-2 ${className}`} aria-label="Social sharing options loading"></div>;
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      <TwitterShareButton url={url} title={title} hashtags={[hashtag]} >
        <TwitterIcon size={iconSize} round={round} />
      </TwitterShareButton>
      
      <FacebookShareButton url={url} quote={title}  hashtag={hashtag}>
        <FacebookIcon size={iconSize} round={round}/>
      </FacebookShareButton>
      
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={iconSize} round={round} />
      </LinkedinShareButton>
      
      <RedditShareButton url={url} title={title}>
        <RedditIcon size={iconSize} round={round} />
      </RedditShareButton>
      
      <WhatsappShareButton url={url} title={title} separator=":: ">
        <WhatsappIcon size={iconSize} round={round} />
      </WhatsappShareButton>
      
      <EmailShareButton url={url} subject={title} body="Check this out: ">
        <EmailIcon size={iconSize} round={round} />
      </EmailShareButton>
    </div>
  )
}

export default SocialShare 