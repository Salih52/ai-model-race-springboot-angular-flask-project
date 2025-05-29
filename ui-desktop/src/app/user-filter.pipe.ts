import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from 'src/models/user';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users:UserModel[], filterText:string): UserModel[] {
    return users.filter(user => user.firstName.toLocaleLowerCase().includes(filterText.toLowerCase())
    || user.lastName.toLocaleLowerCase().includes(filterText.toLowerCase())
    || user.email.toLocaleLowerCase().includes(filterText.toLowerCase())  
    || user.schoolNo.toLocaleLowerCase().includes(filterText.toLowerCase())
  );
  }

}
