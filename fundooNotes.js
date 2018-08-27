var app = angular.module('FundooNotes', ['ui.router', 'ngMaterial','content-editable','ngImgCrop']);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/Login.html',
    controller: 'loginController'
  })
  .state('registration',{
    url:'/registration',
    templateUrl:'templates/Registration.html',
   controller:'loginController'
  })
  .state('forgotPassword',{
    url:'/forgotPassword',
    templateUrl:'templates/ForgotPassWord.html',
   controller:'loginController'
  })
  .state('resetPassword',{
    url:'/resetPassword',
    templateUrl:'templates/ResetPassWord.html',
   controller:'loginController'
  })
  .state('home',{
    url:'/home',
    templateUrl:'templates/Home.html',
    controller:'notesController'
  })
  .state('home.dashboard',{
    url:'/dashboard',
    templateUrl:'templates/dashboard.html',
    controller:'notesController'
  })
  .state('home.trash',{
    url:'/trash',
    templateUrl:'templates/Trash.html',
    controller:'notesController'
  })
  .state('home.archive',{
    url:'/archive',
    templateUrl:'templates/Archive.html',
    controller:'notesController'
  })
  .state('home.reminder',{
    url:'/reminder',
    templateUrl:'templates/ReminderCrds.html',
    controller:'notesController'
  })
  .state('home.label',{
    url:'/label/:name',
    templateUrl:'templates/LabelCrds.html',
    controller:'notesController'
  });

   $urlRouterProvider.otherwise("login");
    });
