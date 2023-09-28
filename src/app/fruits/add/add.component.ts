import { Component } from '@angular/core';
import { Fruits } from '../fruits';
import { Apollo } from 'apollo-angular';
import { CREATe_Fruit } from '../gql/fruits-mutation';
import { Router } from '@angular/router';
import { GET_Fruits } from '../gql/fruits-query';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {

  constructor(private apollo:Apollo, private router:Router){ }

  fruitForm:Fruits={
    id:0,
    name:'',
    quantity:0,
    price:0
  }

  createMethod(){
    this.apollo.mutate<{createFruit:Fruits}>(
      {
        mutation: CREATe_Fruit,
        variables:{
          name:this.fruitForm.name,
          quantity: this.fruitForm.quantity,
          price: this.fruitForm.price
        },
        refetchQueries: [
          { query: GET_Fruits } // Refresh the fruit list after adding a new fruit
        ]
      }).subscribe(({data}) =>{
        this.router.navigate(["/"]);
      }) 
  }

}
    

