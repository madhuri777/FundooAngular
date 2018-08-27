app.controller('loginController', function($scope, $state, $http, $location, userService, $mdDialog, $mdColorPalette, labelService,$rootScope) {


  // function checkForToken() {
  //   token = localStorage.getItem('token');
  //   if(token === null) {
  //     $state.go('login');
  //   }
  //   else{
  //       $state.go('home.dashboard');
  //   }
  // }
  //
  // checkForToken();





  //registration State
  $scope.registation = function() {
    $state.go('registration');
  }


  $scope.login = function() {
    var userLogin = {
      email: $scope.email,
      password: $scope.password
    };
    var url = "http://localhost:8080/FundooNotes/" + 'login';
    userService.postmethod(userLogin, url).then(function successCallback(response) {
      console.log("after login ",response.data);
      localStorage.setItem("token", response.data.token);
    //  localStorage.setItem("email", $scope.email);
      localStorage.setItem("userDto",JSON.stringify(response.data.userdto));
      $state.go('home.dashboard');
    }, function errorCallback(response) {
      alert("user Not Register or Not verified: " + response.status);
    });
  };



  $scope.registartion = function() {
    var registartionUser = {
      name: $scope.userName,
      email: $scope.email,
      password: $scope.password,
      phoneNumber: $scope.PhoneNumber
    };
    var url = "http://localhost:8080/FundooNotes/" + 'registration';
    console.log("registration ", registartionUser);
    userService.postmethod(registartionUser, url).then(function successCallback(response) {
      $state.go('login');
    }, function errorCallback(response) {});
  };




  $scope.forgotPassword = function() {
    $state.go('forgotPassword');
  };




  $scope.changePassWord = function() {
    var email = {
      email: $scope.email
    };
    var url = "http://localhost:8080/FundooNotes/" + 'forgetpassword';
    userService.postmethod(email, url).then(function successCallback(response) {
      alert("Link sent on the email for reset passWord");
    }, function errorCallback(response) {
      alert("in service error ", response);
    });
  };




  $scope.resetPassword = function() {
    var object = $location.search();
    var newPass = {
      newPassWord: $scope.password
    };
    var url = "http://localhost:8080/FundooNotes/" + 'resetpassword/' + object.token
    console.log("password for reset ", newPass);
    userService.putmethod(newPass, url).then(function successCallback(response) {
      alert("successfullya resest padss word");
      $state.go('login');
    }, function errorCallback(response) {
      alert("in service error ", response);
    });
  };

});
