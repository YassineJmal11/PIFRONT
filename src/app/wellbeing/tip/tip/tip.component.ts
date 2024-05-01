import { Component, OnInit } from '@angular/core';
import { Tip } from '../../model/Tip';
import { TipService } from '../../wservices/tip.service';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class TipComponent implements OnInit {
  randomTip: Tip | null = null;
  tipVisible: boolean = false;

  constructor(private tipService: TipService) { }

  ngOnInit(): void {
  }

  toggleTipVisibility() {
    if (!this.tipVisible) {
      this.loadRandomTip();
    } else {
      this.randomTip = null; // Efface le randomTip lorsque l'utilisateur clique à nouveau sur l'icône de la cloche
    }
    this.tipVisible = !this.tipVisible; // Inverse l'état de la visibilité du tip
  }

  loadRandomTip() {
    this.tipService.getRandomTip().subscribe(
      randomTip => {
        console.log('Random Tip:', randomTip);
        this.randomTip = randomTip;
      },
      error => {
        console.error('Error fetching random tip:', error);
      }
    );
  }
}
