import {CHALLENGE_DATE_START, CHALLENGE_DATE_END, TARGET_WORKOUTS, DONATION_EACH} from "./config";
import {Entry} from "./types";

// Using ceil instead of floor, we make the calculation inclusive
const dateToDays = (endDate: Date, startDate: Date): number =>
  Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

const mapStringToDate = (params: {
  date: string,
  hours: number,
  minutes: number,
  seconds: number,
}) => {
  const { date, hours, minutes, seconds } = params;
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export interface ChallengeNotStarted {
  hasStarted: false;
  hasFinished: false;
  dateStart: Date;
}

export interface ChallengeFinished {
  hasStarted: true;
  hasFinished: true;
  successful: boolean;
  donationsRequired: number;
  workouts: number;
}

export interface ChallengeOngoing {
  hasStarted: true;
  hasFinished: false;
  onSchedule: boolean;
  challengeDurationInDays: number;
  daysInChallenge: number;
  daysInChallengeRemaining: number;
  workouts: number;
}

export type ChallengeData = ChallengeNotStarted | ChallengeFinished | ChallengeOngoing;

export const calculateChallengeData = (workouts: Entry[]): ChallengeData => {
  const dateStart = mapStringToDate({
    date: CHALLENGE_DATE_START,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const dateEnd = mapStringToDate({
    date: CHALLENGE_DATE_END,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  if (dateStart.getTime() > Date.now()) {
    // Challenge has yet to start
    return {
      hasStarted: false,
      hasFinished: false,
      dateStart,
    }
  }

  const numWorkouts = workouts.length;

  if (dateEnd.getTime() < Date.now()) {
    // Challenge is finished
    return {
      hasStarted: true,
      hasFinished: true,
      successful: numWorkouts >= TARGET_WORKOUTS,
      donationsRequired: numWorkouts >= TARGET_WORKOUTS
        ? 0
        : (TARGET_WORKOUTS - numWorkouts) * DONATION_EACH,
      workouts: numWorkouts
    };
  }

  // Guess I could use some date-fns functions for this...
  const challengeDurationInDays = dateToDays(dateEnd, dateStart);
  const daysInChallenge = dateToDays(new Date(), dateStart);
  const daysInChallengeRemaining = challengeDurationInDays - daysInChallenge;
  const targetWorkouts = Math.ceil((TARGET_WORKOUTS / challengeDurationInDays) * daysInChallenge);

  return {
    hasStarted: true,
    hasFinished: false,
    onSchedule: workouts.length >= targetWorkouts,
    challengeDurationInDays,
    daysInChallenge,
    daysInChallengeRemaining,
    workouts: numWorkouts
  }
}
