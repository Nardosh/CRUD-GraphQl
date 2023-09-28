import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Fruits } from '../fruits';
import { map, of } from 'rxjs';
import { GET_Fruits } from '../gql/fruits-query';
import { DELETE_Fruit } from '../gql/fruits-mutation';
import { Router } from '@angular/router';

declare var window:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(private apollo:Apollo, private router: Router){ }
  
  allFruits$:Observable<Fruits[]> = of([]);

  deleteModal: any;
  idToDelete:number = 0;

  ngOnInit(): void {

    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    )

    this.allFruits$ = this.apollo
    .watchQuery<{allFruits:Fruits[]}>({query:GET_Fruits, fetchPolicy:'no-cache'})
    .valueChanges.pipe(map((result)=>result.data.allFruits));
   }

   openConfirmationModal(id: number){
    this.idToDelete = id;
    this.deleteModal.show();
   }

  
   delete(){
    this.apollo.mutate<{removeFruit:Fruits}>(
      {
        mutation: DELETE_Fruit,
        variables:{
          id: this.idToDelete
        },
      }).subscribe(({ data }) =>{
          this.deleteModal.hide();
          if (this.allFruits$) {
            this.allFruits$ = this.allFruits$.pipe(
              map(fruits => fruits.filter(fruit => fruit.id !== this.idToDelete))
            );
          }
      }) 
   }
}
