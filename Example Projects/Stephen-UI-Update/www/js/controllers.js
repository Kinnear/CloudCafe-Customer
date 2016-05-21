var app = angular.module('starter.controllers', ["ionic", "firebase", "ngAnimate"]);

app.controller('TermsController', function ($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('my-terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });
});

app.controller('MainCtrl', function ($scope) {
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    // $scope.changeOriantationLandspace = function() {
    //     screen.lockOrientation('landscape');
    // }
    screen.lockOrientation('portrait');
  }
});

app.controller('MyController', function ($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });
});

app.controller("FavouriteController", function ($scope, FavouriteData) {
  $scope.favouriteFata = FavouriteData;
});

// Authentication controller
// Put your login, register functions here
app.controller('AuthCtrl', function ($scope, $ionicHistory) {
  // hide back button in next view
  // $ionicHistory.nextViewOptions({
  //   disableBack: true
  // });
});

// Home controller
app.controller('HomeCtrl', function ($scope, $state, Items, $stateParams) {
  $scope.Items = Items.all();

});

// Category controller
app.controller('CategoryCtrl', function ($scope, $state, Categories, $stateParams, FavouriteData) {
  var id = $stateParams.id;

  // get all items from service by category id
  // for now hardcode the category id to "1"
  $scope.category = Categories.get(1);

  // testing only
  $scope.firebaseTest = FavouriteData;
});

// Item controller
app.controller('ItemCtrl', function ($scope, $state, Items, CartItemData, Auth, StripeCharge, $stateParams, $ionicHistory, $firebaseArray) {
  var itemData = $stateParams.itemData;
  $scope.item = {};
  var itemsRef = new Firebase("https://burning-heat-7015.firebaseio.com/food/" + itemData);
  itemsRef.on('value', function (dataSnapshot) {
    $scope.item = dataSnapshot.val();
  })

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

  $scope.charge = function () {

    $scope.status['loading'] = true;
    $scope.status['message'] = "Retrieving your Stripe Token...";

    second.item = CartItemData.getItemData();
    console.log("Log: " + CartItemData.getItemData().foodName);
    console.log(second.item);

    $scope.ProductMeta['title'] = second.item.foodName;
    $scope.ProductMeta['description'] = second.item.description;
    $scope.ProductMeta['priceUSD'] = second.item.price;

    // first get the Stripe token
    StripeCharge.getStripeToken($scope.ProductMeta).then(
      function (stripeToken) {
        // -->
        proceedCharge(stripeToken);
      },
      function (error) {
        console.log(error)

        $scope.status['loading'] = false;
        if (error != "ERROR_CANCEL") {
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
        function (StripeInvoiceData) {
          $scope.status['loading'] = false;
          $scope.status['message'] = "Success! Check your Stripe Account";
          console.log(StripeInvoiceData);
          console.log(second.item.id);

          var transactionTable = new Firebase('https://burning-heat-7015.firebaseio.com/transactions');
          var transactionTableCollection = $firebaseArray(transactionTable);

          transactionTableCollection.$add({
            "customerID":Auth.$getAuth().uid,
            "foodID": second.item.id,
            "stripeTransactionID": StripeInvoiceData.id,
            "pickuptimestamp":1471351021,
            "timestamp": StripeInvoiceData.created,
            "quantity": 1
          })

          $state.go('transSuccess', { ItemData: second.item, Result: StripeInvoiceData });
        },
        function (error) {
          console.log(error);

          $scope.status['loading'] = false;
          $scope.status['message'] = "Oops... something went wrong";

          $state.go('transFailure', { 'ErrorLog': error });
        }
      );

    }; // ./ proceedCharge

  };
});

// Favorite controller
app.controller('FavoriteCtrl', function ($scope, $state, Items, CartItemData) {

  // get all favorite items
  $scope.items = Items.all()

  // remove item from favorite
  $scope.remove = function (index) {
    $scope.items.splice(index, 1);
  }

  var first = this;
  first.item = CartItemData.getItemData();

  $scope.addtocart = function (index) {
    console.log(index);
    CartItemData.setItemData(index);
    first.item = CartItemData.getItemData();
  }
});


// Purchased controller
app.controller('PurchasedCtrl', function ($scope, $state, PurchasedItems, Auth, $ionicSideMenuDelegate) {

  $scope.products = {};
  $scope.products = PurchasedItems.all();

  $scope.$watch(function () { return PurchasedItems.all() }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
      $scope.products = PurchasedItems.all();
    }
  });
  console.log(Auth.$getAuth().key);
  console.log(Auth.$getAuth().uid);
  $scope.testfunc = function () {
    console.log($scope.products.transactions);
  }
  // disabled swipe menu
  $ionicSideMenuDelegate.canDragContent(false);
});

// Checkout controller
app.controller('CheckoutCtrl', function ($scope, $state) { });

app.controller('ReviewsCtrl', function ($scope, $state) { });

// Address controller
app.controller('AddressCtrl', function ($scope, $state) {
  function initialize() {
    // set up begining position
    var myLatlng = new google.maps.LatLng(21.0227358, 105.8194541);

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
  $scope.init = function () {
    initialize();
  }
});

// User controller
app.controller('UserCtrl', function ($scope, $state) { });

// History Controller
app.controller('HistoryCtrl', function ($scope, $state) { });

// Chat controller, view list chats and chat detail
app.controller('ChatCtrl', function ($scope, Chats) {
  $scope.chats = Chats.all();

  // remove a conversation
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };

  // mute a conversation
  $scope.mute = function (chat) {
    // write your code here
  }
});

app.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, $ionicScrollDelegate, $ionicActionSheet, $timeout) {
  //$scope.chat = Chats.get($stateParams.chatId);
  $scope.chat = Chats.get(0);

  $scope.sendMessage = function () {
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
  $scope.onMessageHold = function (e, itemIndex, message) {
    // show hover menu
    $ionicActionSheet.show({
      buttons: [
        {
          text: 'Copy Text'
        }, {
          text: 'Delete Message'
        }
      ],
      buttonClicked: function (index) {
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

//empty controllers for new pages here
//controller for settings.html
app.controller('SettingsCtrl', function ($scope, $state) { })

//controller for allreviews.html
app.controller('AllreviewsCtrl', function ($scope, $state) { })

//controller for Change Delivery Preferences change.html
app.controller('ChangeCtrl', function ($scope, $state) { })

//controller for Support support.html
app.controller('SupportCtrl', function ($scope, $state) { })

//controller for Shop shop.html
app.controller('ShopCtrl', function ($scope, $state) { })

//controller for location.html
app.controller('LocationCtrl', function ($scope, $state) { })

app.controller("HideSideBarOnThisView", function ($scope, $ionicSideMenuDelegate) {

  $scope.$on('$ionicView.beforeEnter', function () {
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.$on('$ionicView.leave', function () {
    $ionicSideMenuDelegate.canDragContent(true);
  });
});

// Login the customer
app.controller('LoginCustomer', function ($scope, LoginAuthenticatedCheck) {

  $scope.LoginFacebook = function (authMethod) {
    LoginAuthenticatedCheck.AttemptUserLogin(authMethod);
  };
});

app.controller('LogoutAuth', function ($scope, $state, Auth) {

  $scope.Logout = function () {
    Auth.$unauth();
    $state.go('login');
  }
});

app.controller("DisplayCustomerSideInfo", function ($scope, Auth) {

  $scope.userAuthentication = { displayName: null, profilePicture: null };

  $scope.userBakerProfile = Auth.$onAuth(function (authData) {
    if (authData) {
      $scope.userAuthentication.displayName = authData.facebook.displayName;
      $scope.userAuthentication.profilePicture = authData.facebook.profileImageURL;
    } else {
      $scope.userAuthentication = { displayName: null, profilePicture: null };
      console.log("Deleted Previous SideBar Personalized Items.");
    }
  });
});

app.controller('MyController', function ($scope, $ionicModal, CartItemData) {

  $scope.itemData;


  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function (item) {
    console.log("Called");
    $scope.modal.show();
    $scope.itemData = item;
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });

  var first = this;
  first.item = CartItemData.getItemData();

  $scope.addtocart = function (index) {
    console.log(index);
    CartItemData.setItemData(index);
    first.item = CartItemData.getItemData();
    console.log("Log: " + CartItemData.getItemData().foodName);
  }
});

//controller for Transaction Success/Failure
app.controller('SuccessCtrl', function ($scope, $stateParams, $state) {
  $scope.var1 = $stateParams.ItemData;
  $scope.var2 = $stateParams.StripeData;
})

app.controller('FailureCtrl', function ($scope, $state) { })


// app.controller("NavHistoryModifier", function ($scope, $ionicHistory) {

//     $scope.NextViewIsNavRoot = function () {
//         // remove your nav router history
//         $ionicHistory.nextViewOptions({
//             disableBack: false,
//             historyRoot: true
//         });
//     }
// });