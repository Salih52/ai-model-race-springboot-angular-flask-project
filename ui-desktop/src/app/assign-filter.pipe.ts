import { Pipe, PipeTransform } from '@angular/core';
import { AssignModel } from 'src/models/assignModel';

@Pipe({
  name: 'assignFilter'
})
export class AssignFilterPipe implements PipeTransform {

  transform(assigns:AssignModel[], filterText:string) {
    return assigns = assigns.filter(assign => assign.title.toLocaleLowerCase().includes(filterText.toLowerCase())
    || assign.subtitle.toLocaleLowerCase().includes(filterText.toLowerCase())
    || assign.competitionType.toLocaleLowerCase().includes(filterText.toLowerCase())
    );
  }

}
