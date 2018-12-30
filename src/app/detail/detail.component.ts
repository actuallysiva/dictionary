import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DictionaryService } from '../dictionary.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { unionBy, uniq, sortBy } from 'lodash-es';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public fullData;
  public object = {};
  public lexicalEntries = [];
  public byProduct = [];
  public wordOrigin;
  public forms = [];
  public show = false;
  public notes = [];
  public presentWord;
  public antonyms = [];
  public synonyms = [];

  constructor( private route: ActivatedRoute,
    private router: Router, private dictionary: DictionaryService, private location: Location, private toastr: ToastrService) { }

  ngOnInit() {
    // Get the parameter from the URL
    this.route.params.subscribe(routeParams => {
      this.presentWord = routeParams.id;
      this.dictionary.getInfo(routeParams.id).subscribe(
        data => {
          this.fullData = data;
          this.update(this.fullData);
        },
        error => {
          this.handleError(error);
        }
      );
    });
  }
  update(data) {
    this.object = data.results['0'];
    this.lexicalEntries = this.object['lexicalEntries'];
    // Remove unwanted data from the full data
    this.byProduct = this.lexicalEntries.filter(
      lexicalEntry => lexicalEntry.lexicalCategory !== 'Residual'
    );
    // making arrays empty for new data
    this.forms = [];
    this.antonyms = [];
    this.synonyms = [];
    this.notes = [];
    this.wordOrigin = '';
    this.extract(this.byProduct);
  }
  play(audio) {
    audio.play(); // play audio on clicking speak icon
  }
  extract(data) {
    for (const item of data) {
     // console.log(item);
      // Extracting data of word origin
      if (item.entries['0'].etymologies) {
        this.wordOrigin = item.entries['0'].etymologies;
      }
      // Extracting form data
      if (item.entries['0'].hasOwnProperty('variantForms')) {
        this.forms.push(item.entries['0'].variantForms['0'].text);
      }
      // Extract notes
      if (item.entries['0'].hasOwnProperty('notes')) {
        // console.log(item.entries['0'].notes);
        const temp = [];
        for (const note of item.entries['0'].notes) {
          temp.push(note);
        }
        const not = unionBy(temp, 'text');
        this.notes = not;
      }
    }
    this.getSynAnt();
    this.toastr.success(`Definition of ${this.object['word']} is Loaded`);
  }
  // API request to get the synonyms and antonynms
  getSynAnt() {
    this.dictionary.getThesaurus(this.presentWord).subscribe(
      data => {
      const datas = data;
      this.seprateData(datas);
    },
    error => {
     this.handleError(error);
     console.log(error);
    }
  );
  }
  // Seprating synonyms and antonyms from the data into the array
  seprateData(datas) {
    const synonyms = [];
    const antonyms = [];
    for (const data of datas.results['0'].lexicalEntries) {
      // console.log(data.entries['0'].senses);
      for (const syn of data.entries['0'].senses) {
        if (syn.synonyms) {
          synonyms.push(syn.synonyms);
        }
        if (syn.antonyms) {
          antonyms.push(syn.antonyms);
        }
      }
    }
    this.seperateSyn(synonyms);
    this.seperateAnt(antonyms);
  }
  // Seperate functions to retrive synonyms and antonyms
  seperateSyn(data) {
    const temp = [];
    data.map(i => {
      i.map(j => {
        temp.push(j.text);
      });
    });
    // console.log(sortBy(uniq(temp)));
    this.synonyms = sortBy(uniq(temp));
  }
  seperateAnt(data) {
    const temp = [];
    data.map(i => {
      i.map(j => {
        temp.push(j.text);
      });
    });
   // console.log(this.antonyms);
   this.antonyms = sortBy(uniq(temp));
  }
  // Function to handle error responses from the API server
  handleError(error) {
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

}
