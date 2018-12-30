import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../dictionary.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  searchField: FormControl = new FormControl();
  wordList: any;
  displayWords = false;
  public link;

  constructor(private router: Router, private dictionary: DictionaryService, private toastr: ToastrService) { }

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(
        filter(value => !value || value.length > 2 || value !== ''),
        debounceTime(200),
        distinctUntilChanged(),
        filter(value => value !== ''),
        switchMap( query => query.length > 2 ? this.dictionary.getData(query) : this.wordList = ' ')
      )
      .subscribe(
        data => {
          console.log('subscribe data');
          this.wordList = '';
          this.displayWords = true;
          this.wordList = data;
          console.log(data);
        },
        error => {
          console.log(error);
          if (error.status === 404 || error.status === 414) {
            this.toastr.error(`Invalid Word,Try Again with Valid one`, `${error.statusText}`);
          } else if (error.status === 403) {
            this.toastr.error(`Forbidden`, `Contact Developer`);
          } else if (error.status === 500) {
            this.toastr.warning(`Something is Wrong`, `Contact Developer`);
          } else if (error.status === 502 || error.status === 503 || error.status === 504) {
            this.toastr.info(`Sorry for incovinience`, `Bad Gateway`);
          }
        }
      );
  }
  onFocus(value) {
    if (value.length > 0) {
      this.displayWords = true;
    } else {
      this.displayWords = false;
    }
  }
  onListClick(e) {
    this.link = this.router.url.split('/');
    if (this.link.indexOf('definition') > -1) {
      this.displayWords = false;
    }
    e.stopPropagation();
    this.router.navigate([e.target.children['0'].pathname]);
  }
  btnClick(value) {
    // console.log(value);
    const alphabets = /^[A-Za-z ]*$/;
    const regRes = value.match(alphabets);
    console.log(regRes.input);
    if (regRes === null || value === '') {    // if none of the characters are entered it will alert users
      alert('Please Enter a word');
    } else {
      this.router.navigate(['/definition', value]);
    }
  }
}
