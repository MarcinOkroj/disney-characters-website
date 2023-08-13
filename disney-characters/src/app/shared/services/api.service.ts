import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public getCharacters(pageSize: number) {
    return this.http.get(
      `https://api.disneyapi.dev/character?pageSize=${pageSize}`
    );
  }

  public getCharacterByName(name: string) {
    return this.http.get(
      `https://api.disneyapi.dev/character?name=${name
        .trim()
        .replace(' ', '%20')}`
    );
  }

  public getCharacterById(charId: number) {
    return this.http.get(`https://api.disneyapi.dev/character/${charId}`);
  }
}
