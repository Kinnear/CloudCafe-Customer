var app = angular.module('starter.controllers', ["ionic", "firebase"]);


//app.service('productService', function() {
//  var productList = [];
//
//  var addProduct = function(newObj) {
//    productList.push(newObj);
//  };
//
//  var getProducts = function(){
//    return productList;
//  };
//
//  return {
//    addProduct: addProduct,
//    getProducts: getProducts
//  };
//
//});

app.controller("FavouriteController", function($scope, $firebaseArray, VarFactory, fbUrl) {
//  $scope.favouriteFata = FavouriteData;
//   $scope.addItem = function() {
//     var name = prompt("What do you need to buy?");
//     if (name) {
//       $scope.items.$add({
//         "name": name
//       });
//     }
//   };
//
//  $scope.callToAddToProductList = function(currObj){
//    console.log("Here!!");
//    console.log(currObj);
//    productService.addProduct(currObj);
//  };

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

        //seriesRef.once('value',function(datasnapshot2){
        //  console.log(datasnapshot2);
        //}, {dataSnapshot.val():})

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
    //var seriesRef = new Firebase(fbUrl+'/food');
    //seriesRef.orderByKey().on("value", function(snapshot){
    //  //console.log(snapshot.key());
    //  snapshot.forEach(function(childSnapshot){
    //    var val = childSnapshot.val().categoryID;
    //    console.log(val);
    //    console.log(childSnapshot.key())
    //  })
    //});
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
app.controller('CartCtrl', function($scope, Cart, CartItemData, StripeCharge) {
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
            console.log(StripeInvoiceData)
          },
          function(error){
            console.log(error);

            $scope.status['loading'] = false;
            $scope.status['message'] = "Oops... something went wrong";
          }
      );

    }; // ./ proceedCharge

  };
});

// Offer controller
app.controller('OfferCtrl', function($scope, $state, Items, $ionicSideMenuDelegate) {
  // get all items form Items model
  $scope.items = Items.all();

  // toggle favorite
  $scope.toggleFav = function() {
    $scope.item.faved = !$scope.item.faved;
  }

  // disabled swipe menu
  $ionicSideMenuDelegate.canDragContent(false);
});

// Checkout controller
app.controller('CheckoutCtrl', function($scope, $state) {});

// Address controller
app.controller('AddressCtrl', function($scope, $state) {
  function initialize() {
    // set up begining position
    var myLatlng = new google.maps.LatLng(21.0227358,105.8194541);

    // set option for map
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // init map
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    // assign to stop
    $scope.map = map;
  }
  // load map when the ui is loaded
  $scope.init = function() {
    initialize();
  }
});

// User controller
app.controller('UserCtrl', function($scope, $state) {})

// Setting Controller
.controller('SettingCtrl', function($scope, $state) {})

// Chat controller, view list chats and chat detail
.controller('ChatCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();

  // remove a conversation
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

  // mute a conversation
  $scope.mute = function(chat) {
    // write your code here
  }
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout) {
  //$scope.chat = Chats.get($stateParams.chatId);
  $scope.chat = Chats.get(0);

  $scope.sendMessage = function() {
    var message = {
      type: 'sent',
      time: 'Just now',
      text: $scope.input.message
    };

    $scope.input.message = '';

    // push to massages list
    $scope.chat.messages.push(message);

    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
  };

  // hover menu
  $scope.onMessageHold = function(e, itemIndex, message) {
    // show hover menu
    $ionicActionSheet.show({
      buttons: [
        {
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }
      ],
      buttonClicked: function(index) {
        switch (index) {
          case 0: // Copy Text
            //cordova.plugins.clipboard.copy(message.text);

            break;
          case 1: // Delete
            // no server side secrets here :~)
            $scope.chat.messages.splice(itemIndex, 1);
            break;
        }

        return true;
      }
    });
  };

});

//controller for settings.html
app.controller('SettingsCtrl', function($scope, $state) {})

//controller for allreviews.html
app.controller('AllreviewsCtrl', function($scope, $state) {})

//controller for Change Delivery Preferences change.html
app.controller('ChangeCtrl', function($scope, $state) {})

app.controller('ActiveCtrl', function($scope, $state) {})

// History Controller
app.controller('HistoryCtrl', function($scope, $state) {})