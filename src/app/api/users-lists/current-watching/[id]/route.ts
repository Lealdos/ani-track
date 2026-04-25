import { CurrentWatchingController } from '../currentWatchingController'

export const DELETE = CurrentWatchingController.removeItem
export const PATCH = CurrentWatchingController.updateCompleted
export const PUT = CurrentWatchingController.moveToFinished
