import { Indexer, Subscription, UpdateEvent } from '../Indexer'
import { JobQueue } from '../tools/JobQueue'
import { json } from '../tools/json'
import { Logger } from '../tools/Logger'
import {
  BaseIndexerAction,
  baseIndexerReducer,
  BaseIndexerState,
  getInitialState,
} from './reducer'

export abstract class BaseIndexer implements Indexer {
  abstract update(from: number, to: number): Promise<void>

  private state: BaseIndexerState
  private readonly effectsQueue: JobQueue
  constructor(
    private readonly logger: Logger,
    public readonly dependencies: Indexer[],
    public readonly parameters: json,
    config: { batchSize: number },
  ) {
    this.state = getInitialState(dependencies, config.batchSize)
    this.dependencies.forEach((dependency, index) => {
      dependency.subscribe((event) => {
        this.dispatch({
          type: 'DependencyUpdated',
          index,
          height: event.height,
        })
      })
    })
    this.effectsQueue = new JobQueue({ maxConcurrentJobs: 1 }, this.logger)
  }

  subscribe(_callback: (event: UpdateEvent) => void): Subscription {
    throw new Error('Method not implemented.')
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getHeight(): number {
    return this.state.height
  }

  getState(): BaseIndexerState {
    return this.state
  }

  private dispatch(action: BaseIndexerAction): void {
    const [newState, effects] = baseIndexerReducer(this.state, action)

    this.state = newState

    this.logger.debug('Dispatching', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      action: action as any,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      effects: effects as any,
    })
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'Update':
          this.effectsQueue.add({
            name: 'Update',
            execute: async () => {
              const from = this.state.height
              this.dispatch({ type: 'UpdateStarted', from, to: effect.to })
              try {
                await this.update(from, effect.to)
                this.dispatch({ type: 'UpdateSucceeded', from, to: effect.to })
              } catch (e) {
                // @todo: proper error handling: we need retries, backoff and proper support for error on invalidated state
                this.dispatch({ type: 'UpdateFailed', from, to: effect.to })
              }
            },
          })
          break
        default:
          throw new Error('unreachable')
      }
    })
  }
}
