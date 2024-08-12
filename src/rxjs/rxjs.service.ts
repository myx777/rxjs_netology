import { Injectable } from "@nestjs/common";
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from "rxjs";
import axios from "axios";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlabURL = "https://gitlab.com/api/v4/projects?search=";

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}&per_page=${count}`)).pipe(
      map((res: any) => res.data.items),
      take(count),
    );
  }

  private getGitlab(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.gitlabURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        take(count),
      )
      .pipe(take(count));
  }

  async searchRepositories(text: string, hub: string): Promise<any> {
    // Здесь можно добавить логику проверки на какой hub делать запрос
    console.log("hub = ", hub);
    let data$;
    (hub === "github")
      ? (data$ = this.getGithub(text, 10).pipe(toArray()))
      : (data$ = this.getGitlab(text, 10).pipe(toArray()));
    return await firstValueFrom(data$);
  }
}
