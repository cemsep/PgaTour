import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatSortable } from '@angular/material';
import { LeaderboardDataSource } from './leaderboard-datasource';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Player } from '../player.model';
import { Router } from '@angular/router';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { Scorecard } from '../scorecard.model';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class LeaderboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: LeaderboardDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'score'];
  subscription: Subscription;
  expandedElement: Player;
  scorecardTable: Scorecard;
  toggleScorecard = false;


  constructor(private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    this.subscription = this.db.list<Player>('player').valueChanges().pipe(first()).subscribe(d => {
      console.log('data streaming');
      this.dataSource = new LeaderboardDataSource(this.paginator, this.sort);
      this.dataSource.data = d;
    });
    this.sort.sort(<MatSortable>{
      id: 'score',
      start: 'asc'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  onRemove(key: string) {
    this.db.list('player').remove(key);
    this.router.navigate(['/']);
  }

  toggle() {
    if (this.toggleScorecard) {
      this.toggleScorecard = false;
    } else {
      this.toggleScorecard = true;
    }
  }

}
