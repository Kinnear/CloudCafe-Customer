// Ionic Starter App
var SERVER_SIDE_URL             = "https://sleepy-refuge-89064.herokuapp.com/";
var STRIPE_API_PUBLISHABLE_KEY  = "pk_test_h57hQy5dRjVjlM7SoNVYG8Mn";

// Modules currently Using
// Ionic - Base Framework
// UI.Router - Moving of Data
// Stripe - Transaction of money
// Starter.controllers/services - Basic Angular
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
                url: '/item',
                templateUrl: 'templates/item.html',
                controller: 'ItemCtrl',
                params: {itemData: null},
                resolve: {
                    // checkout.js isn't fetched until this is resolved.
                    stripe: StripeCheckoutProvider.load
                }
            })

            // View favorite items
            .state('favorite', {
                url: '/favorite',
                templateUrl: 'templates/favorite.html',
                controller: 'FavoriteCtrl as first'
            })

            // View cart
            .state('cart', {
                url: '/cart/:itemData',
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

            .state('transSuccess', {
                url: '/success',
                templateUrl: 'templates/success.html',
                controller: 'SuccessCtrl',
                params:{'ItemData':null,'StripeData':null}
            })

            .state('transFailure',{
                url: '/failure',
                templateUrl: 'templates/failure.html',
                controller: 'FailureCtrl',
                params: {
                    'ErrorLog':''
                }
            })
            
            //state for support
            .state('support', {
                url: '/support',
                templateUrl: 'templates/support.html',
                controller: 'SupportCtrl'
            })

        // If others are not matched
        $urlRouterProvider.otherwise('/home');
    });
