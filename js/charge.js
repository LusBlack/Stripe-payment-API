// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
//var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
var stripe = Stripe('sk_test_51O1DroGWI9NV34O4M0x0ZkrYxYrWhOHOb6zf9sNvNV2bsVmCkzoWODVFaY6CDb4C3S69yXD1vHK39hxGIXgxHvdo00xiW62ykp');
var elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
var elements = stripe.elements();
var style = {
  base: {
    color: "#32325d",
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
        color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

//style button with bootstrap
document.querySelector('#payment-form button').classList ='btn btn-primary btn-block mt-4';


//create an instance of the card Element
var card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', ({error}) => {
    let displayError = document.getElementById('card-errors');
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  });

  var form = document.getElementById('payment-form');

form.addEventListener('Submit payment', function(event) {
  event.preventDefault();
  // If the client secret was rendered server-side as a data-secret attribute
  // on the <form> element, you can retrieve it here by calling `form.dataset.secret`
 
  stripe.createToken(card).then(function(result) {
    if(result.error) {
      //inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      //send the token to your server
      stripeTokenHandler(result.token);
    }
  });
 
 
  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
  
    // Submit the form
    form.submit();
  }



 stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: 'Jenny Rosen'
      }
    }
  }).then(function(result) {
    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
});
