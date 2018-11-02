import { Scorecard } from './scorecard.model';

export interface Player {
  key: string;
  name: string;
  scorecard: Scorecard;
  score: string;
}
