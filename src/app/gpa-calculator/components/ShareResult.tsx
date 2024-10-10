// ShareResult.tsx
import { Button } from '@/components/Button'
import html2canvas from 'html2canvas'
import { TwitterIcon, TwitterShareButton } from 'next-share'
import React from 'react'

interface ShareResultProps {
  resultRef: React.RefObject<HTMLDivElement>
  shareUrl: string
}

const ShareResult: React.FC<ShareResultProps> = ({ resultRef, shareUrl }) => {
  const handleScreenshot = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current)
      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = 'wam_result.png'
      link.click()
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Button
        onClick={handleScreenshot}
        className="w-full items-center justify-center lg:w-auto"
      >
        Download Screenshot
      </Button>

      <TwitterShareButton
        url={shareUrl}
        title={`Check out my WAM calculation result! My WAM is ${shareUrl.split('wam=')[1] || ''}%`}
        hashtags={['WAMCalculator']}
      >
        <div className="rounded-full dark:hover:ring-emerald-300', flex items-center gap-2 bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300">
          <TwitterIcon size={24} round />
          <span>Share</span>
        </div>
      </TwitterShareButton>
    </div>
  )
}

export default ShareResult
