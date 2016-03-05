String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

var app = angular.module('starter.services', ["ionic", "firebase"])
    .value('fbUrl','https://burning-heat-7015.firebaseio.com/');
    
    
app.service("CurrentUserData", function()
{
    var authenticationData = null;
    
    return {
            getAuthenticationData: function () {
                return authenticationData;
            },
            setAuthenticationData: function(data) {
                authenticationData = data;
            },
            clearAuthenticationData: function(data) {
                authenticationData = null;
            }
        };    
});

// Our Firebase Data Factory retriever
app.factory("FavouriteData", function($firebaseArray) {
  var itemsRef = new Firebase("https://burning-heat-7015.firebaseio.com/");
  return $firebaseArray(itemsRef);
})

app.factory('Categories', function() {
  // Might use a resource here that returns a JSON array
  
  // Some fake testing data
  var categories = [
    {
      id: 1,
      name: "Entrees",
      thumb: 'img/categories/entree.jpg',
      items: [
        {
          id: 1,
          name: "Seared tuna",
          price: 14.20,
          thumb: "img/items/seared_tuna.jpg"
        },
        {
          id: 2,
          name: "Rib eye",
          price: 15.20,
          thumb: "img/items/rib_eyes.jpg"
        },
        {
          id: 3,
          name: "Brick chicken",
          price: 16.20,
          thumb: "img/items/brick_chicken.jpg"
        },
        {
          id: 4,
          name: "Fried calamari",
          price: 17.20,
          thumb: "img/items/fried_calamari.jpg"
        },
        {
          id: 5,
          name: "Zuppa",
          price: 17.20,
          thumb: "img/items/zuppa.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Drinks",
      thumb: 'img/categories/drink.jpg',
      items: []
    },
    {
      id: 3,
      name: "Salads",
      thumb: 'img/categories/salad.jpg',
      items: []
    },
    {
      id: 4,
      name: "Fruits",
      thumb: 'img/categories/fruit.jpg',
      items: []
    },
    {
      id: 5,
      name: "Pizzas",
      thumb: 'img/categories/pizza.jpg',
      items: []
    },
    {
      id: 6,
      name: "Sushi",
      thumb: 'img/categories/sushi.jpg',
      items: []
    },
    {
      id: 7,
      name: "Buggers",
      thumb: 'img/categories/bugger.jpg',
      items: []
    },
  ];

  return {
    all: function() {
      return categories;
    },
    remove: function(cat) {
      categories.splice(categories.indexOf(cat), 1);
    },
    get: function(catId) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === parseInt(catId)) {
          return categories[i];
        }
      }
      return null;
    }
  };
});

app.factory('Items', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var items = [
    {
      id: 1,
      name: "Rib eye steak",
      price: 14.20,
      offer: 40,
      thumb: "img/items/thumbs/rib_eyes.jpg",
      images: [
        "img/items/rib_eye_2.jpg",
        "img/items/rib_eye_3.jpg",
        "img/items/rib_eye_4.jpg"
      ],
      description: "Beef steak, sauce, french fries",
      faved: true,
      reviews: [
        {
          id: 1,
          user_id: 1,
          username: "Adam",
          face: "img/people/adam.jpg",
          text: "Incredibly delicious tender steak! Be sure to order more",
          images: []
        },
        {
          id: 2,
          user_id: 3,
          username: "Ben",
          face: "img/people/ben.png",
          text: "Mmm.... Amazing! Steaks are very good",
          images: []
        },
        {
          id: 3,
          user_id: 3,
          username: "Max",
          face: "img/people/max.png",
          text: "Incredibly delicious tender steak! Be sure to order more",
          images: []
        }
      ]
    },
    {
      id: 2,
      name: "Seared Tuna",
      price: 15.20,
      offer: 20,
      thumb: "img/items/thumbs/seared_tuna.jpg"
    },
    {
      id: 3,
      name: "Brick chicken",
      price: 16.20,
      offer: 40,
      thumb: "img/items/thumbs/brick_chicken.jpg"
    },
    {
      id: 4,
      name: "Fried calamari",
      price: 17.20,
      offer: 50,
      thumb: "img/items/thumbs/fried_calamari.jpg"
    },
    {
      id: 5,
      name: "Zuppa",
      price: 17.20,
      offer: 20,
      thumb: "img/items/thumbs/zuppa.jpg"
    }
  ];

  return {
    all: function() {
      return items;
    },
    remove: function(item) {
      items.splice(items.indexOf(item), 1);
    },
    get: function(itemId) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === parseInt(itemId)) {
          return items[i];
        }
      }
      return null;
    }
  };
});

app.factory('Cart', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var cart = {
    shipping: 6,
    total: 166,
    items: [
      {
        id: 2,
        name: "Seared Tuna",
        price: 15.20,
        thumb: "img/items/thumbs/seared_tuna.jpg",
        quantity: 2
      },
      {
        id: 3,
        name: "Brick chicken",
        price: 16.20,
        thumb: "img/items/thumbs/brick_chicken.jpg",
        quantity: 3
      },
      {
        id: 4,
        name: "Fried calamari",
        price: 17.20,
        thumb: "img/items/thumbs/fried_calamari.jpg",
        quantity: 1
      },
      {
        id: 5,
        name: "Zuppa",
        price: 17.20,
        thumb: "img/items/thumbs/zuppa.jpg",
        quantity: 2
      }
    ]
  };

  return {
    get: function() {
      return cart;
    }
  };
});

app.factory('StripeCharge', function($q, $http, StripeCheckout) {
  var self = this;

  /**
   * Connects with the backend (server-side) to charge the customer
   *
   * # Note on the determination of the price
   * In this example we base the $stripeAmount on the object ProductMeta which has been
   * retrieved on the client-side. For safety reasons however, it is recommended to
   * retrieve the price from the back-end (thus the server-side). In this way the client
   * cannot write his own application and choose a price that he/she prefers
   */
  self.chargeUser = function(stripeToken, ProductMeta) {
    var qCharge = $q.defer();

    var chargeUrl = SERVER_SIDE_URL + "/charge";
    var curlData = {
      stripeCurrency:         "usd",
      stripeAmount:           Math.floor(ProductMeta.priceUSD*100),  // charge handles transactions in cents
      stripeSource:           stripeToken,
      stripeDescription:      "Your custom description here"
    };
    $http.post(chargeUrl, curlData)
        .success(
            function(StripeInvoiceData){
              qCharge.resolve(StripeInvoiceData);
              // you can store the StripeInvoiceData for your own administration
            }
        )
        .error(
            function(error){
              console.log(error)
              qCharge.reject(error);
            }
        );
    return qCharge.promise;
  };


  /**
   * Get a stripe token through the checkout handler
   */
  self.getStripeToken = function(ProductMeta) {
    var qToken = $q.defer();

    var handlerOptions = {
      name: ProductMeta.title,
      description: ProductMeta.description,
      amount: Math.floor(ProductMeta.priceUSD*100),
      image: "img/perry.png",
    };

    var handler = StripeCheckout.configure({
      name: ProductMeta.title,
      token: function(token, args) {
        //console.log(token.id)
      }
    })

    handler.open(handlerOptions).then(
        function(result) {
          var stripeToken = result[0].id;
          if(stripeToken != undefined && stripeToken != null && stripeToken != "") {
            //console.log("handler success - defined")
            qToken.resolve(stripeToken);
          } else {
            //console.log("handler success - undefined")
            qToken.reject("ERROR_STRIPETOKEN_UNDEFINED");
          }
        }, function(error) {
          if(error == undefined) {
            qToken.reject("ERROR_CANCEL");
          } else {
            qToken.reject(error);
          }
        } // ./ error
    ); // ./ handler
    return qToken.promise;
  };


  return self;
})

app.factory('VarFactory', function(VarArrayFactory, fbUrl){
  return function(tableRef){
    var ref = new Firebase(fbUrl+'/'+tableRef);
    console.log(fbUrl+'/'+tableRef);
    return new VarArrayFactory(ref);
  }
});

app.factory('VarArrayFactory', function($firebaseArray, $q){
  return $firebaseArray.$extend({
    findVar:function(defName, varName){
      var deferred = $q.defer();
      // query by 'name'
      this.$ref().orderByChild(defName).equalTo(varName).once("value", function(dataSnapshot){
        if(dataSnapshot.exists()){
          deferred.resolve(dataSnapshot.val());
        } else {
          deferred.reject("Not found.");
        }
      });
      return deferred.promise;
    }
  });
});
