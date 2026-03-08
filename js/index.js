//select element kolo
var contactNameInput=document.getElementById("nameInput");   
var contactNumberInput=document.getElementById("numberInput"); 
var contactEmailInput=document.getElementById("emailInput"); 
var contactAddressInput=document.getElementById("addressInput"); 
var contactGroupInput=document.getElementById("groupInput"); 
var contactNotesInput=document.getElementById("notesInput"); 
var contactFavInput=document.getElementById("favInput"); 
var contactEmergencyInput=document.getElementById("emergencyInput");

var regex={
         name:/^[a-zA-Z]{2,50}$/,
         number:/^(002|\+2)?01[1205][0-9]{8}$/,
         email:/^[\w]{5,20}@(gmail\.com|yahoo\.com)$/,
         group:/^(Family|Friends|Work|School|Other)$/i,
    };
   
var addBtn=document.getElementById("add");
var updateBtn=document.getElementById("update");

var selectedContact="";

var contactList=[];

//no contant msg
 var container="";
if(contactList.length==0){
     container+=`<div class="no-contact-info text-center mt-5">
            <div class="no-contact-icon"><i class="fa-solid fa-address-book dark-gray-color mb-1 fs-xl"></i></div>
            <div class="no-contact-msg">
              <p class="fw-500 dark-gray-color mb-1">No contacts found</p>
              <p class="fs-s light-gray-text">Click "Add Contact" to get started</p>
            </div>
          </div>`;

          document.getElementById("rowdata").innerHTML= container;       
 }

//RETRIEVE
if(localStorage.getItem("contacts")!==null){
   contactList=JSON.parse(localStorage.getItem("contacts"));
     displayContact();
       displayFav();
       displayEmergency();
       displayCounter()
        
}

//CEARTE
    function addContact(){
         var errorobject=validation();
         var objecteKeys=Object.keys(errorobject);
         var objecteValues=Object.values(errorobject);
         
 if( objecteKeys.length>0){
 var alertErrorMsg= objecteValues.map(function(errMsg){
    return`<div class="text-danger fs-xs">${errMsg}</div>`
})
.join(" ")   //from array to string
 document.getElementById("alert-wrapper").innerHTML=alertErrorMsg;
    return;   //user عشان لو طلع عندي مدخلات غلط مخدش البيانات من ال
 }
         
         
        var contact={
            id:Date.now(),
            name:contactNameInput.value,
            number:contactNumberInput.value,
            email:contactEmailInput.value,
            address:contactAddressInput.value,
            group:contactGroupInput.value,
            notes:contactNotesInput.value,
            isFav:contactFavInput.checked,
            isEmergency:contactEmergencyInput.checked,   
        }

        //push contact object into contactList array
        contactList.push(contact);
        console.log(contactList);
     localStorage.setItem("contacts",JSON.stringify(contactList));
        //display contact as a ui
        displayContact();
        displayFav();
       displayEmergency();
       displayCounter()
        
       clearInputs();


// // show success alert
 Swal.fire({
                title: "Added!",
               text: "contact has been added successfully",
               icon: "success"
});


}

 //clear inputs  
 function clearInputs() {
    contactNameInput.value=null;
    contactNumberInput.value=null;
    contactEmailInput.value=null;
    contactAddressInput.value=null;
    contactGroupInput.value=null;
    contactNotesInput.value=null;
    contactFavInput.checked=null;
    contactEmergencyInput.checked=null;
 } 

 //display allcontact or searchcontact
 function displayContact(arr=contactList){
        var htmlMarkup="";
        for(var i=0;i<arr.length;i++){
            htmlMarkup+= `<div class="col-md-4    ">

                <div class="box-info p-4 shadow-sm rounded-4 bg-white ">

                    <div class="title-info d-flex column-gap-2 position-relative ">
                        <div class="info-icon  icon fs-600 fs-md text-white rounded-3">${arr[i].name.toUpperCase()[0]}</div>
                         <div class=" ${arr[i].isFav==true?"d-block":"d-none"} fav-bg-box  circle-icon position-absolute position-fav d-flex" ><i class="fa-regular fa-star fs-xxs text-white  "></i></div>
                         <div class=" ${arr[i].isEmergency==true?"d-block":"d-none"} emergency-bg-box  circle-icon position-absolute position-emergency d-flex "><i class="fa-solid fa-heart-pulse  text-white fs-xxs "></i></div>

                        <div class="title-text ">
                            <h4 class="fw-600 fs-base">${arr[i].name}</h4>
                            <p class="fs-s light-gray-text d-flex"><span class="phone-icon contact-bg  rounded-2 me-2 icon"><i class="fa-solid fa-phone fs-xxs"></i></span>${arr[i].number}</p>
                        </div>
                    </div>

                    <div class="user-email d-flex column-gap-2 mb-2">
                        <span class="email-icon icon rounded-2"><i class="fa-solid fa-envelope email-color fs-xxs"></i></span>
                        <p class=" fs-s light-gray-text mb-1">${arr[i].email}</p>
                    </div>

                    <div class="user-loction  d-flex column-gap-2">
                         <span class="location-icon icon rounded-2 "><i class="fa-solid fa-location-dot fs-xxs location-color"></i></span>
                        <p class=" fs-s light-gray-text mb-1">${arr[i].address}</p>
                    </div>

                    <div class="selected-group location-bg fit fs-xs px-2 py-1 location-color rounded-2 mt-2">${arr[i].group}</div>
                     <p class=" ${arr[i].isEmergency==true?"d-block":"d-none"} emergency-color rose-bg fit rounded-2 mt-2 fs-xs mb-0  "><i class="fa-solid fa-heart-pulse me-2 emergency-color"></i>Emergency</p>

                    <hr>

                    <div class="box-end d-flex justify-content-between">
                       <div class="left-half d-flex">
                         <span class="call-icon icon rounded-3 me-2 cursor"><i class="fa-solid fa-phone fs-xxs location-color "></i></span>
                         <span class="email-icon-big icon rounded-2 cursor"><i class="fa-solid fa-envelope email-color fs-xs"></i></span>
                       </div>

                       <div class="right-half fs-s">
                                <i onclick="toggleIcon(this);toggleFav(${arr[i].id})"  class="${arr[i].isFav==true?"fa-solid":"fa-regular"} fa-star me-3 star-color cursor"></i>
                                <i onclick="toggleIcon(this);toggleEmergency(${arr[i].id})" class=" ${arr[i].isEmergency==true?"fa-solid fa-heart-pulse":"fa-regular fa-heart"} me-3 emergency-color cursor"></i>
                                
                                <span onclick="setFormForUpdate(${arr[i].id})" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa-solid fa-pen me-3 cursor"></i></span>
                                <span onclick="deleteContact(${i})"><i class="fa-solid fa-trash me-3 cursor" ></i></span>
                       </div>
                    </div>

                </div>
                
            </div>
            `;
        }
        document.getElementById("rowdata").innerHTML=htmlMarkup;
 }

//delete contact
function deleteContact(index){
    
    contactList.splice(index,1)
    displayContact();
    displayFav();
    displayEmergency();
    displayCounter()
     localStorage.setItem("contacts",JSON.stringify(contactList));


    
}

//update contact (2 steps)
//find array method (الاصليهarray بتعدل في ال )
function setFormForUpdate(id){
  selectedContact= contactList.find(function(contact){
    return contact.id==id
   })

   contactNameInput.value=selectedContact.name;
   contactNumberInput.value=selectedContact.number;
   contactEmailInput.value=selectedContact.email;
   contactAddressInput.value=selectedContact.address;
   contactGroupInput.value=selectedContact.group;
   contactNotesInput.value=selectedContact.notes;
   contactFavInput.checked=selectedContact.isFav;
   contactEmergencyInput.checked=selectedContact.isEmergency;

   updateBtn.classList.replace("d-none","d-block");
   addBtn.classList.replace("d-block","d-none");

}

function updateContact(){
       selectedContact.name=contactNameInput.value;
       selectedContact.number=contactNumberInput.value;
       selectedContact.email=contactEmailInput.value;
       selectedContact.address=contactAddressInput.value;
       selectedContact.group=contactGroupInput.value;
       selectedContact.notes=contactNotesInput.value;
       selectedContact.isFav=contactFavInput.checked;
       selectedContact.isEmergency=contactEmergencyInput.checked;

displayContact();
displayFav();
displayEmergency();
displayCounter()
clearInputs();
     localStorage.setItem("contacts",JSON.stringify(contactList));
      updateBtn.classList.replace("d-block","d-none");
         addBtn.classList.replace("d-none","d-block");
Swal.fire({
  title: "updated!",
  text: "contact has been updated  successfully",
  icon: "success"
});

}

//search
function searchData(term){
var searchList= contactList.filter(function(contact){
    return contact.name.toLowerCase().includes(term.toLowerCase())   || contact.number.includes(term) || contact.email.toLowerCase().includes(term.toLowerCase()) ;
  })

  displayContact(searchList);
  
  
  
}


function displayFav(){
   var htmlMarkup="" ;
    //step 1(put fav contacts in new array)
var favList=contactList.filter(function(favContact){
    return favContact.isFav==true;
})
    //step 2(display the new array)
for(var i=0;i<favList.length;i++){

    htmlMarkup+=` <div class="d-flex align-items-center ms-2 justify-content-between mt-2 cursor">
                <div class="left d-flex ">
                  <div class="contact-icon icon rounded-3 me-2 fw-600 text-white fs-s">${favList[i].name[0].toUpperCase()}</div>
                <div class="contact-title">
                 <h6 class="mb-0 fw-500 fs-s">${favList[i].name}</h6>
                <p class="mb-0 fs-xs light-gray-text">${favList[i].number}</p>
               </div>
          </div>
              <div class="right">
                   <span class="call-icon icon rounded-3 me-2"><i class="fa-solid fa-phone fs-xxs location-color "></i></span>
               </div>
              </div>`;
}

    document.getElementById("fav-contacts").innerHTML=htmlMarkup;

    var favCounter= document.getElementById("favCounter").innerHTML=favList.length;

    

}
 
function displayEmergency(){
    var htmlMarkup="";
var emergencyList=contactList.filter(function(emergencyContact){
 return emergencyContact.isEmergency==true;
 })
 for(var i=0;i<emergencyList.length;i++){
    htmlMarkup+=`    
   <div class="d-flex align-items-center ms-2 justify-content-between cursor mt-2">
              <div class="left d-flex">
                 <div class="contact-icon icon rounded-3 me-2 fw-600 text-white fs-s">${emergencyList[i].name[0].toUpperCase()}</div>
                <div class="contact-title">
                  <h6 class="mb-0 fw-500 fs-s">${emergencyList[i].name}</h6>
                <p class="mb-0 fs-xs light-gray-text">${emergencyList[i].number}</p>
             </div>
               </div>
               <div class="right">
                    <span class="call-icon icon rounded-3 me-2"><i class="fa-solid fa-phone fs-xxs location-color "></i></span>
               </div>
              </div>
    `;
 }
     document.getElementById("emergency-contacts").innerHTML=htmlMarkup;
var emergencyCounter=document.getElementById("emergencyCounter").innerHTML=emergencyList.length; 


}
//icons change value
function toggleFav (id){
 var contactFind= contactList.find(function(contact){
  return contact.id==id
})
 if(contactFind){
    contactFind.isFav= !contactFind.isFav
}

console.log( contactFind.isFav)
displayContact()
displayFav()
displayCounter()
     localStorage.setItem("contacts",JSON.stringify(contactList));

}

function toggleEmergency (id){
 var contactFind= contactList.find(function(contact){
  return contact.id==id
})
 if(contactFind){
    contactFind.isEmergency= !contactFind.isEmergency
}

console.log(contactFind.isEmergency)
displayContact();
displayEmergency();
displayCounter()
     localStorage.setItem("contacts",JSON.stringify(contactList));


}
// icons change appearence
function toggleIcon(el){
if(el.classList.contains("fa-heart")){
    el.classList.replace("fa-heart","fa-heart-pulse")
    el.classList.replace("fa-regular","fa-solid")
}
else if(el.classList.contains('fa-heart-pulse')){
    el.classList.replace('fa-heart-pulse','fa-heart')
      el.classList.replace('fa-solid','fa-regular');
   }
 else if(el.classList.contains('fa-regular')){
           el.classList.replace('fa-regular','fa-solid');
      

   }
else{
     el.classList.replace('fa-solid','fa-regular');
   }

}

//validation
function validation(){
    var errors={}; 
    
 if(regex.name.test(contactNameInput.value)==false){
        errors.name='Name should contain only letters and spaces (2-50 characters)';

    }

     if(regex.number.test(contactNumberInput.value)==false){
        errors.number='Please enter a valid Egyptian phone number';
    }
 
 if(regex.email.test(contactEmailInput.value)==false){
        errors.email='Please enter a valid email address';
    }
   
if(regex.group.test(contactGroupInput.value)==false){
        errors.group='group is not valid';
    }
  
    return errors

}

function displayCounter(){
var contactCounter=document.getElementById("contactCounter").innerHTML=contactList.length;
}
