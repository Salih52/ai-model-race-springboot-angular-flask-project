import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssignModel } from 'src/models/assignModel';
import { ScoreModel } from 'src/models/scoreModel';

@Injectable({
  providedIn: 'root',
})
export class AssignService {
  private baseUrl: string = environment.apiUrl + 'assign';

  constructor(private http: HttpClient) {}

  newAssign(assign: AssignModel) {
    assign.status = "active"
    return this.http.post(`${this.baseUrl}/create`, assign);
  }

  getAssigns() {
    return this.http
      .get(`${this.baseUrl}/getAll`)
      .pipe(map((assigns) => assigns as AssignModel[]));
  }

  deleteAssign(assign: AssignModel) {
    return this.http.delete(`${this.baseUrl}/delete/${assign.id}`);
  }

  getClassificationScoreList(tableName: string): Observable<ScoreModel[]> {
    const params = new HttpParams().set('tableName', tableName);
    return this.http.post<ScoreModel[]>(`${this.baseUrl}/getClassificationScoreList`, params );
  }

  getRegressionScoreList(tableName: string): Observable<ScoreModel[]> {
    const params = new HttpParams().set('tableName', tableName);
    return this.http.post<ScoreModel[]>(`${this.baseUrl}/getRegressionScoreList`, params );
  }

  endAssign(title:string){
    const params = new HttpParams().set('title', title);
    return this.http.post(`${this.baseUrl}/endAssign`,params);
  }

  updateAssign(title: string, assignDto: AssignModel): Observable<AssignModel> {
    assignDto.status = "active";
    const url = `${this.baseUrl}/updateAssign/${title}`;
    return this.http.put<AssignModel>(url, assignDto);
  }

  getAssignsBySchoolNo(schoolNo: string): Observable<AssignModel[]> {
    const params = new HttpParams().set('schoolNo', schoolNo);
    return this.http.get<AssignModel[]>(`${this.baseUrl}/getAssignsBySchoolNo/${schoolNo}`);
  }
}
