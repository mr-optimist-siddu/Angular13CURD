import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { inject } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  actionBtn : string = "save"


  constructor(private FormBuilder : FormBuilder,
    private api : ApiService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.FormBuilder.group({
      productName : ['',Validators.required],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price : ['',Validators.required],
      Comment : ['',Validators.required],
      date : ['',Validators.required]
    })

    if(this.editData){
      this.actionBtn = "update"
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['Comment'].setValue(this.editData.Comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

  }


  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            this._snackBar.open('Product added successfully','',{
              duration:5000,
            })
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            this._snackBar.open('Error while adding the product','',{
              duration:5000,
            });
          }
        })
      }
    }else{
      this.updateProduct()
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open('Product updated successfully','',{
          duration:5000,
          });
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        this._snackBar.open('Error while updating the product','',{
          duration:5000,
          });
      }
    })

  }


}
