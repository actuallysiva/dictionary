import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../dictionary.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  wordList: any;

  constructor(private route: ActivatedRoute, private router: Router, private dictionary: DictionaryService) { }

  ngOnInit() {
  }

}
