// Ionic Starter App
var SERVER_SIDE_URL             = "sleepy-refuge-89064.herokuapp.com";
var STRIPE_API_PUBLISHABLE_KEY  = "pk_test_h57hQy5dRjVjlM7SoNVYG8Mn";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ui.router', 'stripe.checkout', 'starter.controllers', 'starter.services', 'nl2br', 'monospaced.elastic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
})

    .service("CartItemData", function Item(){
        var item = this;
        //item.message = "DefaultHello (Service)/";
        this.setItemData = function(SetValue){
            console.log("Setting Values");
            item = SetValue;
        }

        this.getItemData = function(){
            return item;
        }
    })

.config(function($stateProvider, $urlRouterProvider, StripeCheckoutProvider) {

    // Define your STRIPE_API_PUBLISHABLE_KEY
    StripeCheckoutProvider.defaults({key: STRIPE_API_PUBLISHABLE_KEY});

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  // login screen
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

  // register screen
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'AuthCtrl'
  })

  // Home screen
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  // Category detail
  .state('category', {
    url: '/category/:id',
    templateUrl: 'templates/category.html',
    controller: 'CategoryCtrl'
  })

  // Item detail
  .state('item', {
    url: '/item/:id',
    templateUrl: 'templates/item.html',
    controller: 'ItemCtrl'
  })

  // View favorite items
  .state('favorite', {
    url: '/favorite',
    templateUrl: 'templates/favorite.html',
    controller: 'FavoriteCtrl as first'
  })

  // View cart
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'CartCtrl as second',
      resolve: {
          // checkout.js isn't fetched until this is resolved.
          stripe: StripeCheckoutProvider.load
      }
  })


  // View ordered items
  .state('last_orders', {
    url: '/last-orders/',
    templateUrl: 'templates/last-orders.html',
    controller: 'CartCtrl'
  })

  .state('active', {
    url: '/active',
    templateUrl: 'templates/active.html',
    controller: 'ActiveCtrl'
  })

  .state('checkout', {
    url: '/checkout',
    templateUrl: 'templates/checkout.html',
    controller: 'CheckoutCtrl'
  })

  .state('address', {
    url: '/address',
    templateUrl: 'templates/address.html',
    controller: 'AddressCtrl'
  })

  .state('user', {
    url: '/user',
    templateUrl: 'templates/user.html',
    controller: 'UserCtrl'
  })

  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'HistoryCtrl'
  })

  // Chat list
  .state('chats', {
    url: '/chats',
    templateUrl: 'templates/chats.html',
    controller: 'ChatCtrl'
  })

  .state('chat-detail', {
    url: '/chats/:chatId',
    templateUrl: 'templates/chat-detail.html',
    controller: 'ChatDetailCtrl'
  })

  .state('reviews', {
               url: '/reviews',
               templateUrl: 'templates/reviews.html',
               controller: 'ReviewsCtrl'
               })
               
 //states for new pages

//state for settings.html
.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  })
  
//state for allreviews
.state('allreviews', {
    url: '/allreviews',
    templateUrl: 'templates/allreviews.html',
    controller: 'AllreviewsCtrl'
  })

//state for change
.state('change', {
    url: '/change',
    templateUrl: 'templates/change.html',
    controller: 'ChangeCtrl'
  })
  
//state for support
.state('support', {
    url: '/support',
    templateUrl: 'templates/support.html',
    controller: 'SupportCtrl'
  })
  
//state for shop
.state('shop', {
    url: '/shop',
    templateUrl: 'templates/shop.html',
    controller: 'ShopCtrl'
  })
  
//state for location
.state('location', {
    url: '/location',
    templateUrl: 'templates/location.html',
    controller: 'LocationCtrl'
  })
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');


});