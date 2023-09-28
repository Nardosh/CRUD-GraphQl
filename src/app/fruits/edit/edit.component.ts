import { Component, OnInit } from '@angular/core';
import { Fruits } from '../fruits';
import { Apollo } from 'apollo-angular';
import { Fruits_ById, GET_Fruits } from '../gql/fruits-query';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UPDATE_Fruit } from '../gql/fruits-mutation';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
constructor(private apollo:Apollo, private route:ActivatedRoute, private router:Router){ }
ngOnInit(): void {
  this.route.paramMap.subscribe((params)=>{
    var id = Number(params.get('id'));
    this.getByid(id);
  });
}
  fruitForm:Fruits={
    id:0,
    name:'',
    quantity:0,
    price:0
  }

  getByid(id:number){
    this.apollo.watchQuery<{allFruits:Fruits[]}>({
      query: Fruits_ById,
      variables:{fruitFilter:{id}}
    })
    .valueChanges
    .subscribe(({data})=>{
      var fruitById = data.allFruits[0];
      this.fruitForm = {
        id:fruitById.id,
        name: fruitById.name,
        quantity: fruitById.quantity,
        price: fruitById.price,
      }
    })


  }

  updateMethod(){
    this.apollo.mutate<{updateFruit:Fruits}>(
      {
        mutation: UPDATE_Fruit,
        variables:{
          id:this.fruitForm.id,
          name:this.fruitForm.name,
          quantity: this.fruitForm.quantity,
          price: this.fruitForm.price
        },
      }).subscribe(({data}) =>{
        this.router.navigate(["/"]);
      }) 

  }
}
