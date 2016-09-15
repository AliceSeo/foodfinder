# Food Finder

Below link is hosted web app

http://alicefoodfinder.azurewebsites.net/

This web application is to recommend food or drink based on user's face.
I used face detect API from Microsoft cognitive service to analyse user's age and gender.
From the photo uploaded by user, it allocates user into a age-gender group


This is Responsive UI implemented by using Bootstrap.
The user clicks and uploads his/her photo on the website and gets a result of analysis of his/her face.
Although the user can go back by clicking go back button on the web browser, I have made a button called "Go back" which lets user go back to main page but also provides some information about how to use this web app by alerting the user with some explanation.


I have implemented Sweet Alert and Fakeloader jQuery.
Sweet Alert appears once the user click "Go Back" button from /drink.html or /meal.html pages.
Also, Fakeloader appears when the user tries to move to other pages.
Each page should have different effect. So, I have included relevant codes into HTML files rather than ts files.


More information about Sweet alert can be seen in:
http://t4t5.github.io/sweetalert/
More information about Fakeloader can be seen in:
http://joaopereirawd.github.io/fakeLoader.js/

Note: I have found that Fakeloader jQuery object requires installation with bower.
So, it was necessary to follow its instruction carefully to install it using bower.


Facebook sharing button implementation is done by following the below link:

https://developers.facebook.com

In order to implement Facebook login, sharing or comments feature, it is necessary to register "Facebook for Developers".
Then, choose the website (because I am developing web apps now).
It requires web url so, this can be done after deploying website on azure and obtaining url from it.
Facebook gave me <script>......</script> code for sharing button. I put it in all pages of HTML files in my App.


Deployment via GitHub allows continuous changes on the web app. Once a code uploaded on GitHub is changed, then it automatically affect the website.

