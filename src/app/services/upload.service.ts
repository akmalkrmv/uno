import { Injectable } from '@angular/core';

// TODO: change to @angular/fire/storage
import * as firebase from 'firebase/app';
// import { AngularFireUploadTask } from '@angular/fire/storage';

export class Upload {
  public key$: string;
  public name: string;
  public url: string;
  public progress: number;

  constructor(public file?: File) {}
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor() {}

  private basePath = '/uploads';
  private uploadTask: firebase.storage.UploadTask;

  public upload(upload: Upload) {
    const storageRef = firebase.storage().ref();

    this.uploadTask = storageRef
      .child(`${this.basePath}/${upload.file.name}`)
      .put(upload.file);

    return new Promise<Upload>((resolve) => {
      this.uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          upload.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => console.log(error),
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            upload.url = downloadURL;
            upload.name = upload.file.name;

            resolve(upload);
          });
        }
      );
    });
  }

  public deleteUpload(key: string): Promise<any> {
    const storageRef = firebase.storage().ref();

    // Create a reference to the file to delete
    var desertRef = storageRef.child(`${this.basePath}/${key}`);

    // Delete the file
    return desertRef
      .delete()
      .then(function () {
        // File deleted successfully
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  }
}
