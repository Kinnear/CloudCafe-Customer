// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'nl2br', 'monospaced.elastic'])

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

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // login screen
  .state('login', {
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
    controller: 'FavoriteCtrl'
  })

  // View cart
  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'CartCtrl'
  })

  // View ordered items
  .state('last_orders', {
    url: '/last-orders/',
    templateUrl: 'templates/last-orders.html',
    controller: 'CartCtrl'
  })

  .state('offer', {
    url: '/offer',
    templateUrl: 'templates/offer.html',
    controller: 'OfferCtrl'
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

  .state('setting', {
    url: '/setting',
    templateUrl: 'templates/setting.html',
    controller: 'SettingCtrl'
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
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
