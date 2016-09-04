// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector = $("#my-file-selector")[0];
// Get elements from DOM
var pageheader = $("#page-description")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var drinkComment = $("#food-description")[0];
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
var drinkRecommendation; //This will be an output
// Register button listeners
imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Please wait. We are analysing your face now...";
    processImage(function (file) {
        // Get emotions based on image
        sendFaceRequest(file, function (faceAttributes) {
            // Find out most dominant emotion
            age = Math.floor(getAge(faceAttributes)); //this is where we send out scores to find out age
            gender = getGender(faceAttributes); //this is where we send out scores to find out gender
            drinkRecommendation = findDrink(age, gender);
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
function findDrink(age, gender) {
    if (age < 20 && gender === "female") {
        drinkRecommendation = orangeJuice;
    }
    else if (age < 20 && gender === "male") {
        drinkRecommendation = coke;
    }
    else if (age < 24 && gender === "female") {
        drinkRecommendation = melot;
    }
    else if (age < 24 && gender === "male") {
        drinkRecommendation = asahi;
    }
    else if (age < 28 && gender === "female") {
        drinkRecommendation = wheatBeer;
    }
    else if (age < 28 && gender === "male") {
        drinkRecommendation = soju;
    }
    else if (age < 31 && gender === "female") {
        drinkRecommendation = cocktail;
    }
    else if (age < 31 && gender === "male") {
        drinkRecommendation = blackBeer;
    }
    else if (age < 36 && gender === "female") {
        drinkRecommendation = smoothie;
    }
    else if (age < 36 && gender === "male") {
        drinkRecommendation = makkoli;
    }
    else if (age < 41 && gender === "female") {
        drinkRecommendation = greenTea;
    }
    else if (age < 41 && gender === "male") {
        drinkRecommendation = longBlack;
    }
    else if (age >= 41 && gender === "female") {
        drinkRecommendation = chardonnay;
    }
    else {
        drinkRecommendation = sake;
    }
    return drinkRecommendation;
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
    pageheader.innerHTML = "Here's " + drinkRecommendation.name + " for you!";
    var img = $("#selected-img")[0]; //getting a predefined area on our webpage to show the emoji
    img.src = drinkRecommendation.picture; //get a picture from the image source
    img.style.display = "block";
    drinkComment.innerHTML = drinkRecommendation.description;
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}
var Drink = (function () {
    function Drink(drinkName, imgLocation, comments) {
        this.drinkName = drinkName;
        this.imgLocation = imgLocation;
        this.comments = comments;
        this.name = drinkName;
        this.picture = imgLocation;
        this.description = comments;
    }
    return Drink;
}());
//----------------List of All drinks---------------------
var orangeJuice = new Drink("Orange Juice", "http://www.howtomakeorangejuice.com/files/photos/Orange_Juice_Recipes_Copyright_2012.jpg", "Fresh Orange Juice!");
var coke = new Drink("Coke", "https://a2ua.com/coke/coke-015.jpg", "Cool, Crispy, Coca cola?! >_<");
var melot = new Drink("Melot", "http://cf.ltkcdn.net/wine/images/std/131752-294x408-Poured-Merlot.jpg", "This one goes well with meat dish!");
var asahi = new Drink("Asahi", "https://www.google.co.nz/search?q=asahi&biw=955&bih=558&site=webhp&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjOnISYjvXOAhXHH5QKHZP5CD4Q_AUIBigB#imgrc=rgsS2B7t2Zp6pM%3A", "Famous Japanese beer for young generation!");
var wheatBeer = new Drink("Wheat Beer", "http://www.beerables.net/images/products/detail/Hoegaarden_Glass.1.png", "Smooth, bubbly lovely and special one for you!");
var soju = new Drink("Soju", "http://www.businesspost.co.kr/news/photo/201506/13418_20808_3828.jpg", "Traditional Korean Liquor! If you combine it with beer, you will see Heaven!");
var blackBeer = new Drink("Black Beer", "http://buffalobeerbiochemist.com/wp-content/uploads/2015/03/Guinness-Draught.jpg", "Soomth, black, full of taste and romance!");
var chardonnay = new Drink("Chardonnay", "http://www.newair.com/kb/wp-content/uploads/2016/05/chardonay3.jpg", "White wine, this one goes well with fish dish!");
var smoothie = new Drink("Fruit Smoothie", "http://keepinitkind.com/wp-content/uploads/2012/08/Pretty-Pink-Smoothie-12.jpg", "Pretty, Lovely, Healthy drink for you!");
var cocktail = new Drink("Cocktail", "http://slideshow.tcmwebcorp.com/slideshow/1/fr/21312312321/medias/slide/38580", "Beautiful look, sweet and fruity drink!");
var makkoli = new Drink("Makgeolli", "http://thumbnail.image.rakuten.co.jp/@0_mall/koreatrade/cabinet/k-foods/sake/tubo.jpg", "Korean rice wine, if you add some liquid yogurt, you will see Heaven I promise!");
var longBlack = new Drink("Long Black", "https://www.drum.fit/wp-content/uploads/2016/03/cup-of-coffee.jpg", "Black, full of odour and temptation, just like you!");
var greenTea = new Drink("Green Tea", "http://2i7kwdob7lx1qne6v2b4pf1s.wpengine.netdna-cdn.com/wp-content/uploads/2015/06/japanese-green-tea.jpg", "Warm, charm green tea will melt you slowly!");
var sake = new Drink("Sake", "http://www.delicious-japan.com/feature/feature1/johnsake03.jpg", "Traditional Japanese strong rice wine, wanna try it like a Samurai? :D");
