import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(public http: HttpClient) {
    console.log('dictionary service  called');
   }
   // Function to get data
   getData(word: string) {
     console.log('entered');
    const firstHeaders = new HttpHeaders();
    const headers: HttpHeaders = firstHeaders
      .append('Accept', 'application/json')
      .append('app_id', 'a64a2713')
      .append('app_key', '6a1c447f942761a04af1df6b11b385d1');
    return this.http.get(`/oxfordapi/search/en?q=${word}&prefix=false&limit=10`, { headers });
  }
   // Function to get full data
   getInfo(word: string) {
    const firstHeaders = new HttpHeaders();
    const headers: HttpHeaders = firstHeaders
      .append('Accept', 'application/json')
      .append('app_id', 'a64a2713' )
      .append('app_key', '6a1c447f942761a04af1df6b11b385d1');
    return this.http.get( `/oxfordapi/entries/en/${word}`, { headers });
  }
  // Function to get synonyms and antonyms
  getThesaurus(word: string) {
    const firstHeaders = new HttpHeaders();
    const headers: HttpHeaders = firstHeaders
      .append('Accept', 'application/json')
      .append('app_id', 'a64a2713')
      .append('app_key', '6a1c447f942761a04af1df6b11b385d1');
    return this.http.get(`/oxfordapi/entries/en/${word}/synonyms;antonyms`, { headers });
  }
}
