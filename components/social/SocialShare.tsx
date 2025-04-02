"use client"

import React from 'react'
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
  round?: boolean
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  className = '',
  iconSize = 32,
  round = true
}) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={iconSize} round={round} />
      </TwitterShareButton>
      
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={iconSize} round={round} />
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