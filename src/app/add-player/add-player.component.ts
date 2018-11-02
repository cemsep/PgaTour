import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Player } from '../player.model';
import { Scorecard } from '../scorecard.model';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {

  player: Player[] = [];
  scorecard: Scorecard = { hole1: null, hole2: null, hole3: null, hole4: null, hole5: null, hole6: null, hole7: null, hole8: null,
                          hole9: null, hole10: null, hole11: null, hole12: null, hole13: null, hole14: null, hole15: null, hole16: null,
                          hole17: null, hole18: null, front9: null, back9: null, total: null };
  score: string;
  options: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  onSubmit() {
    this.db.list('player').push(this.player).then((player) => {
      this.initScorecard();
      this.score = this.scoreCalculate(this.scorecard.total, 73);
      this.db.list('player').update(player.key, { key: player.key, scorecard: this.scorecard, score: this.score }).then(() => {
        console.log('Key assigned');
        console.log('Scorecard assigned');
      });
      this.player = [];
      console.log('success');
    });
  }

  initScorecard() {
    const front9 = this.scorecard.hole1 + this.scorecard.hole2 + this.scorecard.hole3 + this.scorecard.hole4 + this.scorecard.hole5
                  + this.scorecard.hole6 + this.scorecard.hole7 + this.scorecard.hole8 + this.scorecard.hole9;
    const back9 = this.scorecard.hole10 + this.scorecard.hole11 + this.scorecard.hole12 + this.scorecard.hole13 + this.scorecard.hole14
                  + this.scorecard.hole15 + this.scorecard.hole16 + this.scorecard.hole17 + this.scorecard.hole18;
    const total = front9 + back9;

    this.scorecard.front9 = front9;
    this.scorecard.back9 = back9;
    this.scorecard.total = total;
  }

  scoreCalculate(stroke: number, total: number) {
    const score = (total - stroke) * -1;
    if (score > 0) {
      return '+' + score.toString();
    } else if (score === 0) {
      return 'E';
    } else {
      return score.toString();
    }
  }

}
