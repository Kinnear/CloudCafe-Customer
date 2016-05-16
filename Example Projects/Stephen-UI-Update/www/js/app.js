// Ionic Starter App
var SERVER_SIDE_URL = "sleepy-refuge-89064.herokuapp.com";
var STRIPE_API_PUBLISHABLE_KEY = "pk_test_h57hQy5dRjVjlM7SoNVYG8Mn";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ui.router', 'stripe.checkout', 'starter.controllers', 'starter.services', 'nl2br', 'monospaced.elastic', "ngAnimate"]);

app.run(["$rootScope", "$state", "$ionicPlatform", function ($rootScope, $state, $ionicPlatform) {

  $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      // console.log('Going to Home because authentication is required');
      $state.go("login");
    }
  });

  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}]);

app.service("CartItemData", function Item() {
  var item = this;
  //item.message = "DefaultHello (Service)/";
  this.setItemData = function (SetValue) {
    console.log("Setting Values");
    item = SetValue;
  }

  this.getItemData = function () {
    return item;
  }
})

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, StripeCheckoutProvider) {



  // Define your STRIPE_API_PUBLISHABLE_KEY
  StripeCheckoutProvider.defaults({ key: STRIPE_API_PUBLISHABLE_KEY });

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  // login screen
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    // controller: 'LoginCustomer',
    // resolve: {
    //   // controller will not be loaded until $waitForAuth resolves
    //   // Auth refers to our $firebaseAuth wrapper in the example above
    //   currentAuth: function (Auth, $state) {
    //     // $waitForAuth returns a promise so the resolve waits for it to complete

    //     return Auth.$waitForAuth().then(function (authData) {
    //       if (authData != null) {
    //         // $state.go('home');
    //       }
    //     });
    //   }
    // }
  })

    // register screen
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'AuthCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    // Home screen
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    // Category detail
    .state('category', {
      url: '/category/:id',
      templateUrl: 'templates/category.html',
      controller: 'CategoryCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    // Item detail
    .state('item', {
      url: '/item/:id',
      templateUrl: 'templates/item.html',
      controller: 'ItemCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    // View favorite items
    .state('favorite', {
      url: '/favorite',
      templateUrl: 'templates/favorite.html',
      controller: 'FavoriteCtrl as first',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    // View cart
    .state('cart', {
      url: '/cart',
      templateUrl: 'templates/cart.html',
      controller: 'CartCtrl as second',
      resolve: {
        // checkout.js isn't fetched until this is resolved.
        stripe: StripeCheckoutProvider.load,

        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })


    // View ordered items
    .state('last_orders', {
      url: '/last-orders/',
      templateUrl: 'templates/last-orders.html',
      controller: 'CartCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('purchased', {
      url: '/purchased',
      templateUrl: 'templates/purchased.html',
      controller: 'PurchasedCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('checkout', {
      url: '/checkout',
      templateUrl: 'templates/checkout.html',
      controller: 'CheckoutCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('address', {
      url: '/address',
      templateUrl: 'templates/address.html',
      controller: 'AddressCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('user', {
      url: '/user',
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('history', {
      url: '/history',
      templateUrl: 'templates/history.html',
      controller: 'HistoryCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('chat-detail', {
      url: '/chats/:chatId',
      templateUrl: 'templates/chat-detail.html',
      controller: 'ChatDetailCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    .state('reviews', {
      url: '/reviews',
      templateUrl: 'templates/reviews.html',
      controller: 'ReviewsCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //states for new pages

    //state for settings.html
    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //state for allreviews
    .state('allreviews', {
      url: '/allreviews',
      templateUrl: 'templates/allreviews.html',
      controller: 'AllreviewsCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //state for change
    .state('change', {
      url: '/change',
      templateUrl: 'templates/change.html',
      controller: 'ChangeCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //state for support
    .state('support', {
      url: '/support',
      templateUrl: 'templates/support.html',
      controller: 'SupportCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //state for shop
    .state('shop', {
      url: '/shop',
      templateUrl: 'templates/shop.html',
      controller: 'ShopCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

    //state for location
    .state('location', {
      url: '/location',
      templateUrl: 'templates/location.html',
      controller: 'LocationCtrl',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function (Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});