import { IncomingHttpHeaders } from 'node:http'
import { Browser, HTTPResponse, Page, Protocol, Viewport } from 'puppeteer'

import { AnyObject } from './common'
import { ProxyDetails } from '../api'

/* API Config */

// API crawl config

// API crawl config other
export type IntervalTime = number | { max: number; min?: number }

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type PageCookies =
  | string
  | Protocol.Network.CookieParam
  | Protocol.Network.CookieParam[]

export type Platform =
  | 'Android'
  | 'Chrome OS'
  | 'Chromium OS'
  | 'iOS'
  | 'Linux'
  | 'macOS'
  | 'Windows'
  | 'Unknown'

export interface DetailTargetFingerprintCommon {
  ua?: string
  mobile?: '?0' | '?1' | 'random'
  platform?: Platform
  platformVersion?: string
  acceptLanguage?: string
  userAgent?: {
    value: string
    versions?: {
      name: string
      maxMajorVersion?: number
      minMajorVersion?: number
      maxMinorVersion?: number
      minMinorVersion?: number
      maxPatchVersion?: number
      minPatchVersion?: number
    }[]
  }
}

export interface CrawlCommonConfig {
  timeout?: number | null
  proxy?: {
    urls: string[]
    switchByHttpStatus?: number[]
    switchByErrorCount?: number
  } | null
  maxRetry?: number | null
}

// 1.Detail target
export interface CrawlPageDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  cookies?: PageCookies | null
  priority?: number
  viewport?: Viewport | null
  fingerprint?:
    | (DetailTargetFingerprintCommon & {
        maxWidth?: number
        minWidth?: number
        maxHeight?: number
        minHidth?: number
      })
    | null
}

export interface CrawlDataDetailTargetConfig extends CrawlCommonConfig {
  url: string
  method?: Method
  headers?: AnyObject | null
  params?: AnyObject
  data?: any
  priority?: number
  fingerprint?: DetailTargetFingerprintCommon | null
}

export interface CrawlFileDetailTargetConfig extends CrawlCommonConfig {
  url: string
  headers?: AnyObject | null
  priority?: number
  storeDir?: string | null
  fileName?: string | null
  extension?: string | null
  fingerprint?: DetailTargetFingerprintCommon | null
}

// 2.Advanced
export interface CrawlPageAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlPageDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: (DetailTargetFingerprintCommon & {
    maxWidth?: number
    minWidth?: number
    maxHeight?: number
    minHidth?: number
  })[]

  headers?: AnyObject
  cookies?: PageCookies
  viewport?: Viewport

  onCrawlItemComplete?: (crawlPageSingleResult: CrawlPageSingleResult) => void
}

export interface CrawlDataAdvancedConfig<T> extends CrawlCommonConfig {
  targets: (string | CrawlDataDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]

  headers?: AnyObject

  onCrawlItemComplete?: (
    crawlDataSingleResult: CrawlDataSingleResult<T>
  ) => void
}

export interface CrawlFileAdvancedConfig extends CrawlCommonConfig {
  targets: (string | CrawlFileDetailTargetConfig)[]
  intervalTime?: IntervalTime
  fingerprints?: DetailTargetFingerprintCommon[]
  storeDirs?: string | (string | null)[]
  extensions?: string | (string | null)[]
  fileNames?: (string | null)[]

  headers?: AnyObject

  onCrawlItemComplete?: (crawlFileSingleResult: CrawlFileSingleResult) => void
  onBeforeSaveItemFile?: (info: {
    id: number
    fileName: string
    filePath: string
    data: Buffer
  }) => Promise<Buffer>
}

export interface StartPollingConfig {
  d?: number
  h?: number
  m?: number
}

/* API Result */
export interface CrawlCommonResult {
  id: number
  isSuccess: boolean
  maxRetry: number
  retryCount: number
  proxyDetails: ProxyDetails
  crawlErrorQueue: Error[]
}

export interface CrawlPageSingleResult extends CrawlCommonResult {
  data: {
    browser: Browser
    response: HTTPResponse | null
    page: Page
  }
}

export interface CrawlDataSingleResult<D> extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: D
  } | null
}

export interface CrawlFileSingleResult extends CrawlCommonResult {
  data: {
    statusCode: number | undefined
    headers: IncomingHttpHeaders
    data: {
      isSuccess: boolean
      fileName: string
      fileExtension: string
      mimeType: string
      size: number
      filePath: string
    }
  } | null
}
