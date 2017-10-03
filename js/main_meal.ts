// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector : HTMLInputElement = <HTMLInputElement> $("#my-file-selector")[0]; 

// Get elements from DOM
var pageheader = $("#page-description")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var foodComment = $("#food-description")[0];
var pagecontainer = $("#page-container")[0]; 

//This is for SweetAlert Button: making a button and applying swal
var goBackButton = $("#goBack")[0];

goBackButton.addEventListener("click", function () {
    swal({
        title: "Are you sure?",
        text: "Do you want to go back?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                window.location.href = "index.html"
            } else {
                swal("Cancelled", "Please upload your photo, \nso we can recommend you something tasty :P", "success");
                }
        });
 
});

var age: any; //This will be obtained after sendFaceRequest
var gender: string; //This will be obtained after sendFaceRequest

var userCompliment = $("#user-compliment")[0];
var compliment: string; //After analysing face, tell user you look great, showing his/her expected age at the same time
var foodRecommendation: Food; //This will be an output

// Register button listeners
imgSelector.addEventListener("change", function () { // file has been picked
    pageheader.innerHTML = "Please wait. We are analysing your face now...";
    processImage(function (file) { //this checks the extension and file
        // Get emotions based on image
        sendFaceRequest(file, function (faceAttributes) { //here we send the API request and get the response
            // Find out most dominant emotion
            age = Math.floor(getAge(faceAttributes)); //this is where we send out scores to find out age
            gender = getGender(faceAttributes);//this is where we send out scores to find out gender
            foodRecommendation = findFood(age, gender);
            compliment = getQuote(age, gender);

            changeUI(compliment);            
        });
    });
});


function processImage(callback) : void {
    var file = imgSelector.files[0];  //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    } else {
        console.log("Invalid file");
    }
    reader.onloadend = function () { 
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)){
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        } else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    }
}


function sendFaceRequest(file, callback) : void {
    $.ajax({
        url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "68addf4ed1fc46148b81b824fe25d92b");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
            if (data.length != 0) { // if a face is detected
                // Get the face attributes: {"gender": "female", "age": 23.9}
                var faceAttributes = data[0].faceAttributes;
                callback(faceAttributes);

            } else {
                pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}

function getAge(faceAttributes: any): any{
    return faceAttributes.age;
}
function getGender(faceAttributes: any): string{
    return faceAttributes.gender;
}

function findFood(age: any, gender: string): Food{//depending on age and gender, food is determined
    if (age < 20 && gender === "female"){
        foodRecommendation = chocolateIceCream;
    }
    else if(age < 20 && gender === "male"){
        foodRecommendation = pizza;
    }
    else if(age < 24 && gender === "female"){
        foodRecommendation = sushi;
    }
    else if(age < 24 && gender === "male"){
        foodRecommendation = ramen;
    }
    else if(age < 28 && gender === "female"){
        foodRecommendation = eggBenedict;
    }
    else if(age < 28 && gender === "male"){
        foodRecommendation = hamburgSteak;
    }
    else if(age < 31 && gender === "female"){
        foodRecommendation = steak;
    }
    else if(age < 31 && gender === "male"){
        foodRecommendation = takoyaki;
    }
    else if(age < 36 && gender === "female"){
        foodRecommendation = asianFriedRice;
    }
    else if(age < 36 && gender === "male"){
        foodRecommendation = koreanBBQ;
    }
    else if(age < 41 && gender === "female"){
        foodRecommendation = deepFriedChicken;
    }
    else if(age < 41 && gender === "male"){
        foodRecommendation = grilledEel;
    }
    else if(age >= 41 && gender === "female"){
        foodRecommendation = crepe;
    }
    else{
        foodRecommendation = iceCreamPie;
    }

    return foodRecommendation;
}

var genderQuote: string;
function getQuote(age: any, gender: string) :string{
    if (gender === "female"){
        genderQuote = "pretty lady";
    }
    else{
        genderQuote = "handsome gentle man";
    }
    return "You look like " + age + " years old " + genderQuote + "."
}

function changeUI(compliment: string) : void {
    userCompliment.innerHTML = compliment;
    pageheader.innerHTML = "Here's " + foodRecommendation.name + " for you!";
    var img : HTMLImageElement = <HTMLImageElement>  $("#selected-img")[0];//getting a predefined area on our webpage to show the emoji
    img.src = foodRecommendation.picture; //get a picture from the image source
    img.style.display = "block"; 
    foodComment.innerHTML = foodRecommendation.description;
    
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}

class Food{
    name: string;
    picture: string; //location
    description: string;
    constructor(public foodName, public imgLocation, public comments){
        this.name = foodName;
        this.picture = imgLocation;
        this.description = comments;
    }
}

//----------------List of All foods---------------------
var pizza: Food = new Food("Pizza", "http://media.giphy.com/media/2LqQkIPKNevkc/giphy.gif", "Everyone loves pizza. And I bet you will.");
var hamburgSteak: Food = new Food("Japanese Ham-burger Steak", "http://cfile25.uf.tistory.com/image/23410C3352DB5C9E2DBF30", "Japanese people eat a thick ham burger pattie as a steak with special sauce!");
var pasta: Food = new Food("Cheesy Pasta","http://cfile2.uf.tistory.com/image/21745736568BC116228A4F", "Sometimes we want to eat cheeeeesy stuff, right? :P");
var iceCreamPie: Food = new Food("Strawberry Waffle","http://cfile7.uf.tistory.com/image/2473363652DB5C83183ECD", "Waffle, maple syrup and strawberry will show you the Heaven!");
var crepe: Food = new Food("Vanilla Ice cream with choco Syrup", "https://mblogthumb-phinf.pstatic.net/20150207_213/rlazmfflfk_1423235660262ukPzd_GIF/tumblr_mccnqvsviN1rjvjgmo1_500.gif?type=w2", "Look at that CHOCOLATE sauce!! Can you stand this?!");
var grilledEel: Food = new Food("Grilled Eel", "http://cfile8.uf.tistory.com/image/252CEE3B56570F6812FB84", "Yucky? NO!!! This tastes amazing and it is also really good for your stemina!");
var steak: Food = new Food("Scotch Fillet Steak", "https://68.media.tumblr.com/694694c8df0a41829c2facd1b3e53a40/tumblr_o5hrlsfYmW1vr2vt8o1_500.gif", "Planning to eat steak? Then of course, scotch fillet steak!");
var deepFriedChicken: Food = new Food("Korean Deep Fried Chicken","https://media.giphy.com/media/xlFUYARvMLg7C/giphy.gif","with Beer, we call this 'Chi-Maek' meaning chicken and beer:D");
var koreanBBQ: Food = new Food("Korean BBQ", "http://ext.fmkorea.com/files/attach/images/3655304/157/051/041/8cf51a6b3681d4c9ef35b25f4d4ede1f.gif", "Korean BBQ. Grill it while you eat it!!");
var eggBenedict: Food = new Food("Egg Benedict with smoked Salmon", "http://i.huffpost.com/gadgets/slideshows/295861/slide_295861_2415525_free.gif", "So traditional, well-known French dish! Poached egg is very healthy!");
var sushi: Food = new Food("Maki Sushi (Roll sushi)", "http://33.media.tumblr.com/a9af7ffd8e2704d852feaa575583b792/tumblr_mr80w5oK6l1rdn0rdo3_500.gif", "Pretty, cute, Tasty sushi with full of fresh ingredients!");
var chocolateIceCream: Food = new Food("Chocolate Ice cream Cake", "http://i.imgur.com/JRplAMd.gif", "OMG... yeah no one say No! to chocolate right?");
var asianFriedRice: Food = new Food("Asian Style Fried Rice", "http://i.imgur.com/AA5P1Ag.gif", "Light fried rice with chicken breast. Don't forget to add some Mayo!!");
var takoyaki: Food = new Food("Takoyaki (Octopus balls)", "https://media.tenor.co/images/0c756d061c6195d81f7d60bf2d1c2f92/raw", "Well-known Japanese street food! Minced octopus inside grilled balls!!");
var ramen: Food = new Food("Instant Ramen", "http://cfile5.uf.tistory.com/image/2138BE3A52DB5C722D7C43", "Are you too busy to cook something fancy? Ok, then Ramen is your choice!!");
