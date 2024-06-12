import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FileModel } from 'src/models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl : string;

  constructor(private http:HttpClient) { 
    this.baseUrl = "https://backend:8080/files";
  }

  upload(testFile: FileList, title: string, file?: FileList): Observable<HttpEvent<any>> {
    console.log("odev: " + file, "test: " + testFile, "title: " + title);
    const formData: FormData = new FormData();

    if (file && file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
      }
    }

    if (testFile.length > 0) {
      for (let i = 0; i < testFile.length; i++) {
        formData.append('testFile', testFile[i]);
      }
    }

    formData.append('title', title);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadAdmin`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
}



  uploadUser(file: FileList, title:string , assignTitle:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    if(file.length > 0){
      for(let i = 0; i < file.length; i++){
        formData.append('file', file[i]);
      }
    }

    formData.append('title', title);
    formData.append('assignTitle', assignTitle);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadUser`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFilesUser(fileName: string, assignTitle:string): Observable<FileModel[]> {
    const formData: FormData = new FormData();
    formData.append('fileName', fileName);
    formData.append('assignTitle', assignTitle);
    const req = new HttpRequest('POST', `${this.baseUrl}/getFilesUser`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event.body as FileModel[]; // Assuming your response body is an array of FileModel
        }
        return []; // Or you can return an empty array or handle other cases accordingly
      })
    );
  }

  getFilesAdmin(fileName: string): Observable<FileModel[]> {
    const formData: FormData = new FormData();
    formData.append('fileName', fileName);
    const req = new HttpRequest('POST', `${this.baseUrl}/getFilesAdmin`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event.body as FileModel[]; // Assuming your response body is an array of FileModel
        }
        return []; // Or you can return an empty array or handle other cases accordingly
      })
    );
  }

  deleteFiles(){
    return this.http.delete(`${this.baseUrl}/delete`);
  }
}

