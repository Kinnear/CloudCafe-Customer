var app = angular.module('starter.controllers', ["ionic", "firebase", "ngAnimate"]);

app.directive('flippy', function () {
  return {
    restrict: 'EA',
    link: function ($scope, $elem, $attrs) {

      var options = {
        flipDuration: ($attrs.flipDuration) ? $attrs.flipDuration : 400,
        timingFunction: 'ease-in-out',
      };

      // setting flip options
      angular.forEach(['flippy-front', 'flippy-back'], function (name) {
        var el = $elem.find(name);
        if (el.length == 1) {
          angular.forEach(['', '-ms-', '-webkit-'], function (prefix) {
            angular.element(el[0]).css(prefix + 'transition', 'all ' + options.flipDuration / 1000 + 's ' + options.timingFunction);
          });
        }
      });

      /**
       * behaviour for flipping effect.
       */
      $scope.flip = function () {
        $elem.toggleClass('flipped');
      }

    }
  };
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
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
});

// Home controller
app.controller('HomeCtrl', function ($scope, $state, Categories, Auth) {
  // get all categories from service
  $scope.categories = Categories.all();

  // Auth.$unauth();
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
app.controller('ItemCtrl', function ($scope, $state, Items, $stateParams) {
  var id = $stateParams.id;

  // get item from service by item id
  $scope.item = Items.get(1);

  // toggle favorite
  $scope.toggleFav = function () {
    $scope.item.faved = !$scope.item.faved;
  }
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

// Cart controller
app.controller('CartCtrl', function ($scope, Cart, CartItemData, StripeCharge) {
  // set cart items
  $scope.cart = Cart.get();

  // plus quantity
  $scope.plusQty = function (item) {
    item.quantity++;
  }

  // minus quantity
  $scope.minusQty = function (item) {
    if (item.quantity > 1)
      item.quantity--;
  }

  // remove item from cart
  $scope.remove = function (index) {
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

  $scope.charge = function () {

    $scope.status['loading'] = true;
    $scope.status['message'] = "Retrieving your Stripe Token...";

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
          console.log(StripeInvoiceData)
        },
        function (error) {
          console.log(error);

          $scope.status['loading'] = false;
          $scope.status['message'] = "Oops... something went wrong";
        }
      );

    }; // ./ proceedCharge

  };
});

// Active controller
app.controller('ActiveCtrl', function ($scope, $state, Items, $ionicSideMenuDelegate) {
  // get all items form Items model
  $scope.items = Items.all();

  // toggle favorite
  $scope.toggleFav = function () {
    $scope.item.faved = !$scope.item.faved;
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
app.controller('UserCtrl', function ($scope, $state) { })

  // History Controller
  .controller('HistoryCtrl', function ($scope, $state) { })

  // Chat controller, view list chats and chat detail
  .controller('ChatCtrl', function ($scope, Chats) {
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
app.controller('LoginCustomer', function ($scope, $state, Auth) {

  var offAuth = null;

  $scope.login = function (loginType) {

    offAuth = Auth.$onAuth(function (authData) {
      if (authData === null) {
        // console.log("No data was found that the user is logged in.");
        Auth.$authWithOAuthRedirect(loginType).then(function (authData) {
        }).catch(function (error) {
          if (error.code === 'TRANSPORT_UNAVAILABLE') {
            Auth.$authWithOAuthPopup(loginType).then(function (error, authData) {
              if (error) {
                console.log("Login Failed!", error);
              }
              else {
                console.log("Authenticated successfully with payload:", authData);
                // Apply our scope outside of angular on our html as well.
                // $scope.$apply();
              }
            });
          }
          else {
            console.log("Some error has occured");
            console.log(error);
          }
        });

        console.log("Finished trying out the onAuth function");
      }
      else {
        console.log('Successfully attempted to log in. Logged in as', authData.uid);
      }
      $scope.authData = authData; // This will display the user's name in our view
    });
  }
});

app.controller('LogoutAuth', function ($scope, $state, Auth) {

  $scope.Logout = function () {
    Auth.$unauth();
    $state.go('login');
  }
})