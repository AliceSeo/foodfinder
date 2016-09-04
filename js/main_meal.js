// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector = $("#my-file-selector")[0];
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
    }, function (isConfirm) {
        if (isConfirm) {
            window.location.href = "index.html";
        }
        else {
            swal("Cancelled", "Please upload your photo, \nso we can recommend you something tasty :P", "success");
        }
    });
});
var age; //This will be obtained after sendFaceRequest
var gender; //This will be obtained after sendFaceRequest
var userCompliment = $("#user-compliment")[0];
var compliment; //After analysing face, tell user you look great, showing his/her expected age at the same time
var foodRecommendation; //This will be an output
// Register button listeners
imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Please wait. We are analysing your face now...";
    processImage(function (file) {
        // Get emotions based on image
        sendFaceRequest(file, function (faceAttributes) {
            // Find out most dominant emotion
            age = Math.floor(getAge(faceAttributes)); //this is where we send out scores to find out age
            gender = getGender(faceAttributes); //this is where we send out scores to find out gender
            foodRecommendation = findFood(age, gender);
            compliment = getQuote(age, gender);
            changeUI(compliment);
        });
    });
});
function processImage(callback) {
    var file = imgSelector.files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}
function sendFaceRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceAttributes=age,gender",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "1b3db931b67143a68c4cdd73137ab9bd");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            // Get the face attributes: {"gender": "female", "age": 23.9}
            var faceAttributes = data[0].faceAttributes;
            callback(faceAttributes);
        }
        else {
            pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
        }
    })
        .fail(function (error) {
        pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}
function getAge(faceAttributes) {
    return faceAttributes.age;
}
function getGender(faceAttributes) {
    return faceAttributes.gender;
}
function findFood(age, gender) {
    if (age < 20 && gender === "female") {
        foodRecommendation = chocolateIceCream;
    }
    else if (age < 20 && gender === "male") {
        foodRecommendation = pizza;
    }
    else if (age < 24 && gender === "female") {
        foodRecommendation = sushi;
    }
    else if (age < 24 && gender === "male") {
        foodRecommendation = ramen;
    }
    else if (age < 28 && gender === "female") {
        foodRecommendation = eggBenedict;
    }
    else if (age < 28 && gender === "male") {
        foodRecommendation = hamburgSteak;
    }
    else if (age < 31 && gender === "female") {
        foodRecommendation = steak;
    }
    else if (age < 31 && gender === "male") {
        foodRecommendation = takoyaki;
    }
    else if (age < 36 && gender === "female") {
        foodRecommendation = asianFriedRice;
    }
    else if (age < 36 && gender === "male") {
        foodRecommendation = koreanBBQ;
    }
    else if (age < 41 && gender === "female") {
        foodRecommendation = deepFriedChicken;
    }
    else if (age < 41 && gender === "male") {
        foodRecommendation = grilledEel;
    }
    else if (age >= 41 && gender === "female") {
        foodRecommendation = crepe;
    }
    else {
        foodRecommendation = iceCreamPie;
    }
    return foodRecommendation;
}
var genderQuote;
function getQuote(age, gender) {
    if (gender === "female") {
        genderQuote = "pretty lady";
    }
    else {
        genderQuote = "handsome gentle man";
    }
    return "You look like " + age + " years old " + genderQuote + ".";
}
function changeUI(compliment) {
    userCompliment.innerHTML = compliment;
    pageheader.innerHTML = "Here's " + foodRecommendation.name + " for you!";
    var img = $("#selected-img")[0]; //getting a predefined area on our webpage to show the emoji
    img.src = foodRecommendation.picture; //get a picture from the image source
    img.style.display = "block";
    foodComment.innerHTML = foodRecommendation.description;
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}
var Food = (function () {
    function Food(foodName, imgLocation, comments) {
        this.foodName = foodName;
        this.imgLocation = imgLocation;
        this.comments = comments;
        this.name = foodName;
        this.picture = imgLocation;
        this.description = comments;
    }
    return Food;
}());
//----------------List of All foods---------------------
var pizza = new Food("Pizza", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fimg1.cyberpr.co.kr%2F2013%2F10%2F201310302332097472.gif", "Everyone loves pizza. And I bet you will.");
var hamburgSteak = new Food("Japanese Ham-burger Steak", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fwww.gasengi.com%2Fdata%2Fcheditor4%2F1312%2F1bd1e655617f6c627d9f991e4e9dd471_1386601364.88.gif", "Japanese people eat a thick ham burger pattie as a steak with special sauce!");
var pasta = new Food("Cheesy Pasta", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fupload.inven.co.kr%2Fupload%2F2010%2F06%2F25%2Fbbs%2Fi33243272.gif", "Sometimes we want to eat cheeeeesy stuff, right? :P");
var iceCreamPie = new Food("Walnut Ice cream pie", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fi.giphy.com%2FYqAxkzjdPjJ4s.gif", "Have you heard of Ice Cream Pie? With crunchy walnut it will show you the Heaven!");
var crepe = new Food("Crepe with vanilla Ice cream", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fi.giphy.com%2FwkHfxM60qAJdC.gif", "Look at that CHOCOLATE sauce!! Can you stand this?!");
var grilledEel = new Food("Grilled Eel", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fwww.jjalbang.me%2Fskyim2008%2Fvxjt0hg1a.gif", "Yucky? NO!!! This tastes amazing and it is also really good for your stemina!");
var steak = new Food("Scotch Fillet Steak", "https://image-proxy.namuwikiusercontent.com/r/http%3A%2F%2Fi58.tinypic.com%2Ffbjqmo.gif", "Planning to eat steak? Then of course, scotch fillet steak!");
var deepFriedChicken = new Food("Deep Fried Korean Chicken", "https://image-proxy.namuwikiusercontent.com/r/https%3A%2F%2F38.media.tumblr.com%2F3455c46004254f0c8d765c79cc884e0b%2Ftumblr_noll3kGAyY1tj7dq3o1_540.gif", "with Beer, we call this 'Chi-Maek' meaning chicken and beer:D");
var koreanBBQ = new Food("Korean BBQ", "http://ext.fmkorea.com/files/attach/images/3655304/157/051/041/8cf51a6b3681d4c9ef35b25f4d4ede1f.gif", "Korean BBQ. Grill it while you eat it!!");
var eggBenedict = new Food("Egg Benedict with smoked Salmon", "http://i.huffpost.com/gadgets/slideshows/295861/slide_295861_2415525_free.gif", "So traditional, well-known French dish! Poached egg is very healthy!");
var sushi = new Food("Maki Sushi (Roll sushi)", "http://33.media.tumblr.com/a9af7ffd8e2704d852feaa575583b792/tumblr_mr80w5oK6l1rdn0rdo3_500.gif", "Pretty, cute, Tasty sushi with full of fresh ingredients!");
var chocolateIceCream = new Food("Chocolate Ice cream Cake", "http://i.imgur.com/JRplAMd.gif", "OMG... yeah no one say No! to chocolate right?");
var asianFriedRice = new Food("Asian Style Fried Rice", "http://i.imgur.com/AA5P1Ag.gif", "Light fried rice with chicken breast. Don't forget to add some Mayo!!");
var takoyaki = new Food("Takoyaki (Octopus balls)", "https://media.tenor.co/images/0c756d061c6195d81f7d60bf2d1c2f92/raw", "Well-known Japanese street food! Minced octopus inside grilled balls!!");
var ramen = new Food("Instant Ramen", "http://cfile10.uf.tistory.com/image/275A7E4356571620283370", "Are you too busy to cook something fancy? Ok, then Ramen is your choice!!");
