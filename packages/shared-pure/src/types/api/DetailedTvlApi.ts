import z from 'zod'

import { AssetId } from '../AssetId'
import { branded } from '../branded'
import { ChainId } from '../ChainId'
import { UnixTime } from '../UnixTime'
import { ValueType } from '../ValueType'

const DetailedTvlApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
])
export type DetailedTvlApiChartPoint = z.infer<typeof DetailedTvlApiChartPoint>

const DetailedTvlApiChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
    z.string(),
  ]),
  data: z.array(DetailedTvlApiChartPoint),
})
export type DetailedTvlApiChart = z.infer<typeof DetailedTvlApiChart>

export const DetailedTvlApiCharts = z.object({
  hourly: DetailedTvlApiChart,
  sixHourly: DetailedTvlApiChart,
  daily: DetailedTvlApiChart,
})
export type DetailedTvlApiCharts = z.infer<typeof DetailedTvlApiCharts>

export const DetailedTvlApiToken = z.object({
  assetId: branded(z.string(), AssetId),
  chainId: branded(z.number(), ChainId),
  valueType: branded(z.string(), ValueType),
  usdValue: z.number(),
})

export type DetailedTvlApiToken = z.infer<typeof DetailedTvlApiToken>

export const DetailedTvlApiProject = z.object({
  tokens: z.object({
    CBV: z.array(DetailedTvlApiToken),
    EBV: z.array(DetailedTvlApiToken),
    NMV: z.array(DetailedTvlApiToken),
  }),
  charts: DetailedTvlApiCharts,
})
export type DetailedTvlApiProject = z.infer<typeof DetailedTvlApiProject>

export const DetailedTvlApiResponse = z.object({
  bridges: DetailedTvlApiCharts,
  layers2s: DetailedTvlApiCharts,
  combined: DetailedTvlApiCharts,
  projects: z.record(z.string(), DetailedTvlApiProject.optional()),
})
export type DetailedTvlApiResponse = z.infer<typeof DetailedTvlApiResponse>