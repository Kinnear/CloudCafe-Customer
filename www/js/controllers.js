var app = angular.module('starter.controllers', ["ionic", "firebase"]);

app.controller("FavouriteController", function($scope, $firebaseArray, $state, VarFactory, fbUrl) {
  $scope.AllFoodData;
  $scope.tableName = '';
  $scope.defName = '';
  $scope.varName = '';

  $scope.findVar = function() {
    var seriesRef = new Firebase(fbUrl+'/'+$scope.tableName);
    var seriesCollection = $firebaseArray(seriesRef);
    seriesCollection.$ref().orderByChild($scope.defName).equalTo($scope.varName).once("value", function(dataSnapshot){
      var series = dataSnapshot.val();
      if(series){
        console.log("Found", series);
        $scope.series = series;
        console.log(dataSnapshot.toString());
        console.log(getParent(dataSnapshot.child("categoryID")));

        dataSnapshot.orderByKey().on("child_added", function(snapshot){
          console.log(snapspot.key());
        });
      } else {
        console.warn("Not found.");
      }
    });
  };

  $scope.getAll = function(){
    var seriesRef = new Firebase(fbUrl+'/'+$scope.tableName);
    var seriesCollection = $firebaseArray(seriesRef);
    seriesCollection.$ref().on("value", function(snapshot) {
      var newpost = snapshot.val();

      // this prints the ID out
      console.log(newpost);
      $scope.AllFoodData = snapshot.val();
      console.log($scope.AllFoodData['food1']);

      snapshot.forEach(function(childObj){
        console.log("The example key is " + childObj.key() + " and has values of");
        console.log(childObj.val());
        var ObjWithKey = childObj.val();
        ObjWithKey['Key'] = childObj.key();
        console.log("The new obj is " + ObjWithKey['foodName'] + ' - ' + ObjWithKey['Key']);
        $scope.AllFoodData[childObj.key()] = ObjWithKey;
      })

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    return $firebaseArray(seriesRef);
  }

  $scope.test = function() {
    //$state.go('transSuccess' , {'ItemData':'Js1','StripeData':'Js2'});
  }

  function getParent(snapshot) {
    // You can get the reference (A Firebase object) from a snapshot
    // using .ref().
    var ref = snapshot.ref();
    // Now simply find the parent and return the name.
    return ref.parent().key();
  }
});


// Authentication controller
// Put your login, register functions here
app.controller('AuthCtrl', function($scope, $ionicHistory) {
  // hide back button in next view
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
});

// Home controller
app.controller('HomeCtrl', function($scope, $state, Categories) {
    // get all categories from service
    $scope.categories = Categories.all();
});

// Category controller
app.controller('CategoryCtrl', function($scope, $state, Categories, $stateParams, FavouriteData) {
  var id = $stateParams.id;

  // get all items from service by category id
  // for now hardcode the category id to "1"
  $scope.category = Categories.get(1);
  
  // testing only
  $scope.firebaseTest = FavouriteData;
});

// Item controller
app.controller('ItemCtrl', function($scope, $state, Items, $stateParams) {
    var id = $stateParams.id;

    // get item from service by item id
    $scope.item = Items.get(1);

    // toggle favorite
    $scope.toggleFav = function() {
      $scope.item.faved = !$scope.item.faved;
    }
});

// Favorite controller
app.controller('FavoriteCtrl', function($scope, $state, Items, CartItemData) {

  // get all favorite items
  $scope.items = Items.all()

  // remove item from favorite
  $scope.remove = function(index) {
    $scope.items.splice(index, 1);
  }

  var first = this;
  first.item = CartItemData.getItemData();

  $scope.addtocart = function(index){
    console.log(index);
    CartItemData.setItemData(index);
    first.item = CartItemData.getItemData();
  }
});

// Cart controller
app.controller('CartCtrl', function($scope, $state, $firebaseArray, Cart, CartItemData, StripeCharge, fbUrl) {
  // set cart items
  $scope.cart = Cart.get();

  // plus quantity
  $scope.plusQty = function(item) {
    item.quantity++;
  }

  // minus quantity
  $scope.minusQty = function(item) {
    if(item.quantity > 1)
      item.quantity--;
  }

  // remove item from cart
  $scope.remove = function(index) {
    $scope.cart.items.splice(index, 1);
  }

  // Router Thingy
  var second = this;
  second.item = CartItemData.getItemData();

  // Stripe JS
  $scope.ProductMeta = {
    title: "Awesome product",
    description: "Yes it really is",
    priceUSD: 1,
  };

  $scope.status = {
    loading: false,
    message: "",
  };

  $scope.charge = function() {

    $scope.status['loading'] = true;
    $scope.status['message'] = "Retrieving your Stripe Token...";

    console.log(second.item.foodName);

    $scope.ProductMeta['title'] = second.item.foodName;
    $scope.ProductMeta['description'] = second.item.description;
    $scope.ProductMeta['priceUSD'] = second.item.price;

    // first get the Stripe token
    StripeCharge.getStripeToken($scope.ProductMeta).then(
        function(stripeToken){
          // -->
          proceedCharge(stripeToken);
        },
        function(error){
          console.log(error)

          $scope.status['loading'] = false;
          if(error != "ERROR_CANCEL") {
            $scope.status['message'] = "Oops... something went wrong";
          } else {
            $scope.status['message'] = "";
          }
        }
    ); // ./ getStripeToken

    function proceedCharge(stripeToken) {

      $scope.status['message'] = "Processing your payment...";

      // then chare the user through your custom node.js server (server-side)
      StripeCharge.chargeUser(stripeToken, $scope.ProductMeta).then(
          function(StripeInvoiceData){
            $scope.status['loading'] = false;
            $scope.status['message'] = "Success! Check your Stripe Account";
            console.log(StripeInvoiceData);
            console.log(second.item.Key);

            var transactionTable = new Firebase(fbUrl+'/transactions');
            var transactionTableCollection = $firebaseArray(transactionTable);

            transactionTableCollection.$add({
              "foodID":second.item.Key,
              "stripeTransactionID":StripeInvoiceData.id,
              "timestamp":StripeInvoiceData.created,
              "quantity":1
            })

            $state.go('transSuccess', {ItemData: second.item, Result: StripeInvoiceData});
          },
          function(error){
            console.log(error);

            $scope.status['loading'] = false;
            $scope.status['message'] = "Oops... something went wrong";

            $state.go('transFailure', {'ErrorLog': error});
          }
      );

    }; // ./ proceedCharge

  };
});

// User controller
app.controller('UserCtrl', function($scope, $state) {})

// Setting Controller
.controller('SettingCtrl', function($scope, $state) {})

//controller for settings.html
app.controller('SettingsCtrl', function($scope, $state) {})

//controller for allreviews.html
app.controller('AllreviewsCtrl', function($scope, $state) {})

app.controller('ActiveCtrl', function($scope, $state) {})

// History Controller
app.controller('HistoryCtrl', function($scope, $state) {})

//controller for Transaction Success/Failure
app.controller('SuccessCtrl', function($scope, $stateParams, $state) {
  $scope.var1 = $stateParams.ItemData;
  $scope.var2 = $stateParams.StripeData;
})

app.controller('FailureCtrl', function($scope, $state) {})

// facebook authentication! woo hoo!
app.controller("FacebookAuthentication", function($scope, Auth, $state, CurrentUserData, fbUrl, $location){

    // $scope.userData = CurrentUserData.getAuthenticationData();
    // $scope.loginType = null;
    
    // console.log("Code in the controller ran.");
    // console.log("Service says logged in is " + CurrentUserData.getUserLoggedIn());
    // console.log("$scope.loginType = " + $scope.loginType);
    // console.log("$scope.userData = below");
    // console.log($scope.userData);
    var killAuth = Auth.$onAuth(function(authData)
    {
        if(authData != null)
        {
            console.log("Redirect to home as, Logged in already before as:", authData.uid);
            
            // save our login details to the system over here
            // checks to see if this facebook user has registered with us before
            var allUsers = new Firebase(fbUrl).child("users");
            
            allUsers.orderByChild(authData.provider).equalTo(authData.uid).once('value', function(snapshot) {
                
                if(!snapshot.exists())
                {
                    allUsers.push({                            
                            // the user's username
                            "username": authData.facebook.displayName,
                            // the user's provider ID
                            [authData.provider] : authData.uid
                    });
                    console.log("The user doesn't exist! Therefore we have a new user to add.");
                }
                else 
                {
                    console.log("That user already exists");
                }
            });
            
            killAuth();
            CurrentUserData.setAuthenticationData(authData); 
            
            $location.path('home');
        }
        else
        {
            console.log("Currently logged out");     
        }
    });
    
    var offAuth = null;

    $scope.LoginFacebook = function(authMethod)
    {
        offAuth = Auth.$onAuth(function(authData) 
        {
            if (authData === null) 
            {
                // console.log("No data was found that the user is logged in.");
                Auth.$authWithOAuthRedirect(authMethod).then(function(authData)
                {
                }).catch(function(error) 
                {
                    if (error.code === 'TRANSPORT_UNAVAILABLE') 
                    {
                        Auth.$authWithOAuthPopup(authMethod).then(function(error, authData) 
                        {
                            if (error) 
                            {
                                    console.log("Login Failed!", error);
                            }
                            else
                            {
                                console.log("Authenticated successfully with payload:", authData);
                                // Apply our scope outside of angular on our html as well.
                                // $scope.$apply();
                            }
                        });
                    }
                    else
                    {
                        console.log("Some error has occured");
                        console.log(error);
                    }
                });
                
                console.log("Finished trying out the onAuth function");
            }
            else
            {
                console.log('Successfully attempted to log in. Logged in as', authData.uid);                
                // $location.path('home');
            }
            $scope.authData = authData; // This will display the user's name in our view
        });
    }
    
    $scope.LogoutAuthentication = function()
    { 
        CurrentUserData.clearAuthenticationData();
        
        // if our authentication callback does not exist, we dont need to remove the callback
        if(offAuth != null)
        {
            console.log("OnAuth has been called therefore we remove the callback");
            offAuth();
        }
        Auth.$unauth();
    //     CurrentUserData.clearAuthenticationData();
    //     $scope.userData = null;
    //     // $scope.loggedIn = false;
    //     CurrentUserData.setUserLoggedIn(false);
    //     $scope.loginType = null;
        $location.path('login');
        console.log("Logout Authentication was called.");
    };
    
    // function authDataCallback(authData)
    // {
    //     if (authData) 
    //     {
    //         CurrentUserData.setAuthenticationData(authData);
            
    //         $scope.userData = CurrentUserData.getAuthenticationData();
    //         // $scope.loggedIn = true;
    //         CurrentUserData.setUserLoggedIn(true);
            
    //         // checks to see if this facebook user has registered with us before
    //         var allUsers = new Firebase(fbUrl).child("users");
            
    //         allUsers.orderByChild(CurrentUserData.getAuthenticationData().provider).equalTo(CurrentUserData.getAuthenticationData().uid).once('value', function(snapshot) {
                
    //             if(!snapshot.exists())
    //             {
    //                 allUsers.push({                            
    //                         // the user's username
    //                         "username": CurrentUserData.getAuthenticationData().facebook.displayName,
    //                         // the user's provider ID
    //                         [CurrentUserData.getAuthenticationData().provider] : CurrentUserData.getAuthenticationData().uid
    //                 });
    //                 console.log("The user doesn't exist! Therefore we have a new user to add.");
    //             }
    //             else 
    //             {
    //                 console.log("That user already exists");
    //             }
    //         });
            
    //         // change over to the login page when the user has successfully logged in
    //         $state.go('home');
    //     }
    //     else 
    //     {
    //         console.log("AuthData callback was called. ");
    //         CurrentUserData.clearAuthenticationData();
    //         // $scope.loggedIn = false;
    //         CurrentUserData.setUserLoggedIn(false);
    //     }
    // }
});

app.controller("HideNavaigation", function($scope, $state, $ionicHistory){
    
    $scope.isStateLogin = function()
    {
        return $state.is('login');    
    };
});

app.controller("DeletePreviousNavigation", function($scope, $ionicHistory){
    
        $scope.$on('$ionicView.beforeEnter', function() {
            //runs every time the page activates
             $ionicHistory.clearCache();
             $ionicHistory.clearHistory();    
    
            // remove your nav router history
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true,
                historyRoot: true
            });
        });
});