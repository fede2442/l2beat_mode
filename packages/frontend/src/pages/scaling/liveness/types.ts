import {
  DataAvailabilityMode,
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  LivenessApiResponse,
  LivenessDetails,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { SyncStatus } from '../../types'
export interface LivenessPagesData {
  tvlApiResponse: TvlApiResponse
  livenessApiResponse: LivenessApiResponse
  implementationChange?: ImplementationChangeReportApiResponse
}

export interface ScalingLivenessViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: DataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  hasImplementationChanged?: boolean
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  explanation: string | undefined
  data: ScalingLivenessViewEntryData | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}

export interface ScalingLivenessViewEntryData {
  batchSubmissions: LivenessDetailsWithWarning | undefined
  stateUpdates: LivenessDetailsWithWarning | undefined
  proofSubmissions: LivenessDetailsWithWarning | undefined
  syncStatus: SyncStatus
}

export type LivenessDetailsWithWarning = LivenessDetails & {
  syncStatus: SyncStatus
  warning?: string
}

export type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry
export interface AnomalyEntry {
  isAnomaly: true
  anomalies: Anomaly[]
}

export interface NonAnomalyEntry {
  isAnomaly: false
}
export interface Anomaly {
  type: 'TX DATA SUBMISSION' | 'STATE UPDATE' | 'PROOF SUBMISSION'
  timestamp: number
  durationInSeconds: number
}
