app.factory('userService', function($http,$state) {
  var factory = {};

  factory.postmethod = function(data,url) {
    return $http({
      method: 'POST',
      url: url,
      headers: { 'userid': localStorage.getItem('token')},
      data: data
    })
  };

  factory.putmethod = function(newPass,url) {
    return $http({
      method: 'PUT',
      data: newPass,
      headers: { 'userid': localStorage.getItem('token')},
      url: url
    })
  };

  factory.getMethod=function(url){
    return $http({
        method:'get',
        url:url,
        headers:{'userid':localStorage.getItem('token')}
    })
  };

  factory.deleteMethod=function(url){
    return $http({
      method:'delete',
      url:url,
      headers:{'userid':localStorage.getItem('token')}
    })
  };

  factory.imageUploadMethod = function(file,url) {

    return $http({
      method: 'POST',
      url: url,
      headers: { 'Content-Type': undefined},
      data:file
    })
  };
  return factory;

});
