app.controller('notesController', function($filter, $scope, $location, $state, userService, $mdDialog, $mdPanel, $mdToast, labelService, $mdSidenav) {

  $scope.user = JSON.parse(localStorage.getItem('userDto'));
  console.log("user ",$scope.user);
  // document.getElementById("ToolBarColor").style.background-color = "#f1b401";
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



  var date = new Date();
  $scope.ddMMyyyy = $filter('date')(new Date(), ' HH:mm:ss a');
  console.log("current time ", $scope.ddMMyyyy);


  var url = $location.path().split('/');
  $scope.secondParameter = url[3];
  console.log("state name ",);

  $scope.getTrColor = function (colorIndex) {
    if(colorIndex=='dashboard'){
      return '#f1b401';
    }else{
      return 'rgb(96, 125, 139)';
    }
  };

  $scope.toggleLeft = buildToggler('left');
  $scope.thisScope = $scope;

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
      if ($mdSidenav(componentId).isOpen()) {
        document.getElementById("dashboard").style.marginLeft = "50px";
      } else {
        document.getElementById("dashboard").style.marginLeft = "0px";
      }
    };
  }

  $scope.createNote = function() {
    console.log("create note madhe " + $scope.imageUrl);
    var description = $('#description').html();
    var title = $('#title').html();
    var note = {
      title: title,
      discription: description,
      colour: $scope.createnotecolor,
      image: $scope.imageUrl
    };
    console.log("create note ", note);
    var url = "http://localhost:8080/FundooNotes/" + "createnotes";
    var token = localStorage.getItem("token");
    if (note.title != '' || note.discription != '' || note.image != undefined) {
      userService.postmethod(note, url).then(function successCallback(response) {
        $scope.getAllNotes();
      }, function errorCallback(response) {});
    }

  };


  $scope.getAllNotes = function() {
    var url = "http://localhost:8080/FundooNotes/" + "getallnotesofuser";
    userService.getMethod(url).then(function successCallback(response) {
      $scope.getNotes = response.data;
      console.log("All Notes ", $scope.getNotes);
    }, function errorCallback(response) {});
  };


  $scope.getAllNotes();

  $scope.getAllabels = function() {
    var url = "http://localhost:8080/FundooNotes/" + "getallabels";
    userService.getMethod(url).then(function successCallback(response) {
      $scope.getLabels = response.data;
      console.log("latest label ", $scope.getLabels);
    }, function errorCallback(response) {
      console.log("in get label service error ", response.data);
    });
  }

  $scope.getAllabels();

  $scope.deleteClick = function(index, note) {
    if (index == 1) {
      note.trash = false;
      var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
      userService.putmethod(note, url).then(function successCallback(response) {
        $scope.getAllNotes();
      }, function errorCallback(response) {
        $scope.getAllNotes();
      });
    }

    if (index == 0) {
      console.log("dlete forever method");
      var url = "http://localhost:8080/FundooNotes/" + "deletnote/" + note.noteid;
      userService.deleteMethod(url).then(function successCallback(response) {
        console.log("in trashenote put service ", response.data);
        $scope.getAllNotes();
      }, function errorCallback(response) {
        $scope.getAllNotes();
        console.log("in erro block for trash service error ", response.data);
      });
    }
  }


  $scope.updateDialogCard = function(ev, items, template) {
    $mdDialog.show({
      locals: {
        item: items,
        Notes: $scope.getNotes,
        panel: $scope.reminderPanel,
        OuterScope: $scope
      },
      templateUrl: 'templates/' + template + '.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      controller: DialogCardController,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen
    })
  };

  function DialogCardController($scope, $mdPanel, $mdDialog, item, Notes, OuterScope) {
    $scope.user = JSON.parse(localStorage.getItem('userDto'));
    OuterScope.getAllNotes();
    $scope.collaboratorUser = item.shareTo;
    console.log("collaborator shareTo ", item.shareTo);
    $scope.item = item;
console.log("item in dialog box ",item);
    $scope.upadtenote = function(note) {
      note.title = $scope.item.title;
      note.discription = $scope.item.discription;
      var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
      userService.putmethod(note, url).then(function successCallback(response) {
        console.log("successfully update");
        OuterScope.getAllNotes();
      }, function errorCallback(response) {
        console.log("successfully not update");
        OuterScope.getAllNotes();
      });
    }
   $scope.getImgeByName=function(name){
    var data= OuterScope.getInitials(name);
    return data;
   }

    $scope.Close = function() {
      $mdDialog.hide();
    }

    $scope.addCollaborator = function() {
      var email = $scope.selectedItem.emailId;

      var url = "http://localhost:8080/FundooNotes/" + "addcollaborator/" + email;

      userService.postmethod(item, url).then(function successCallback(response) {
        console.log("response succ ", Notes.shareTo);
      }, function errorCallback(response) {
        OuterScope.getAllNotes();
        $scope.CollaboratorUser = item.shareTo;
        console.log("response succ ", item.shareTo);
      });
      $scope.CollaboratorUser = Notes.shareTo;
      $scope.selectedItem = "";
    }


    $scope.removeCollaborator = function(user) {
      console.log("user id for remove ", user.userId);
      var url = "http://localhost:8080/FundooNotes/" + "removecollaborator/" + user.userId;

      userService.postmethod(item, url).then(function successCallback(response) {
        OuterScope.getAllNotes();
        $scope.CollaboratorUser = item.shareTo;
        console.log("response succ ", OuterScope.getNotes);
      }, function errorCallback(response) {
        console.log("response succ ", response.data);
      });

      console.log("In delete collaborator ", user);
    }

    $scope.getAllUser = function() {
      var url = "http://localhost:8080/FundooNotes/" + "getAllUsers";
      userService.getMethod(url).then(function successCallback(response) {
        $scope.userList = response.data;
      }, function errorCallback(response) {});
    }
    $scope.getAllUser();

  };


  $scope.upadteColor = function(color, note) {
    console.log("update color ", color);
    console.log("update note ", note);

    if (note == undefined) {
      $scope.createnotecolor = color.color;
    }
    if (note != undefined) {
      note.colour = color.color;
      var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
      userService.putmethod(note, url).then(function successCallback(response) {
        $scope.getAllNotes();
      }, function errorCallback(response) {
        $scope.getAllNotes();
      });
    }
  }


  $scope.isArchive = function(note) {
    var archiveStatus = note.archive;
    if (archiveStatus == true) {
      var archiveStatus1 = false;
      $scope.showSimpleToast('Note UnArchive ');
    } else {
      var archiveStatus1 = true;
      $scope.showSimpleToast('Note Archive ');
    }
    note.archive = archiveStatus1;
    var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
    userService.putmethod(note, url).then(function successCallback(response) {
      $scope.getAllNotes();
    }, function errorCallback(response) {
      $scope.getAllNotes();
    });
  }


  $scope.isPin = function(note) {
    console.log("controll in isPin function ", note);
    var pinStatus = note.pin;
    console.log("archive value ", pinStatus);
    if (pinStatus == true) {
      var pinStatus1 = false;
    } else {
      var pinStatus1 = true;
    }

    note.pin = pinStatus1;
    console.log("updteded color ", note);
    var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
    userService.putmethod(note, url).then(function successCallback(response) {
      $scope.getAllNotes();
    }, function errorCallback(response) {
      $scope.getAllNotes();
    });
  }

  $scope.removeLabel = function(note) {
    console.log("remove Label ", note);
  }

  $scope.reminderPanel = function(ev, note, noteid, templatePage) {
    console.log("panel reminder ", templatePage);
    $scope.currentDate = new Date();
    var position = $mdPanel.newPanelPosition()
      // .absolute().center();
      .relativeTo(ev.target)
      // .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW);
      .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);
    console.log("position of panel ", position);
    var config = {
      locals: {
        label: $scope.getLabels,
        note: note,
        spe: $scope.thisScope
      },
      attachTo: angular.element(document.body),
      controller: ReminderPanelCtrl,
      templateUrl: 'templates/' + templatePage + '.html',
      position: position,
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 10,
    };
    $mdPanel.open(config);
  }


  function ReminderPanelCtrl(mdPanelRef, $timeout, $scope, note, label, spe) {
    var date = new Date();
    $scope.ddMMyyyy = $filter('date')(new Date(), ' HH:mm:ss a');
    $scope.selected = note.label;
    $scope.labels = spe.getLabels;
    $scope.label = label;

    $scope.more = true;
    $scope.note = note;
    $scope.reminder = true;

    $scope.pickDateTime = function() {
      $scope.reminder = false;
    }
    this._mdPanelRef = mdPanelRef;

    $scope.date = function() {
      if (note == undefined) {
        $scope.createreminder = $scope.birthday;
      } else {
        var date = $scope.birthday;
        note.reminder = $scope.birthday;
        var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
        userService.putmethod(note, url).then(function successCallback(response) {
          $scope.getAllNotes();
        }, function errorCallback(response) {
          $scope.getAllNotes();
        });
      }
      $scope.remove = function() {
        $scope.createreminder = null;
      }

    }
    $scope.close = function() {
      mdPanelRef && mdPanelRef.close();
    };

    $scope.trashClick = function() {
      console.log("trashclick ", note);
      note.trash = true;
      var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
      userService.putmethod(note, url).then(function successCallback(response) {
        spe.getAllNotes();
      }, function errorCallback(response) {
        spe.getAllNotes();
      });
      $scope.close();
    }
    $scope.hidemore = function() {
      console.log("hide method ");
      $scope.more = false;
    }
    $scope.exists = function(item, list) {
      for (var i = 0; i < list.length; i++) {
        var selectedobject = list[i];
        if (selectedobject.labelName == item.labelName) {
          return true;
        }
      }
      return false;
    };

    $scope.labelCheck = function(item, list) {

      var url = "http://localhost:8080/FundooNotes/" + "addlabels/" + item.labelId;
      userService.postmethod(note, url).then(function successCallback(response) {
        console.log("response successfully");
        //  $scope.getAllNotes();
        spe.getAllabels();
        spe.getAllNotes();
        //s.getAllabels();
      }, function errorCallback(response) {
        console.log("response error");
        // $scope.getAllNotes();
      });

      console.log("labelcheck list ", list);
      console.log("labelcheck ", list);
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
        console.log("if part ", list);
      } else {
        list.push(item);
      }

    };
  }

  $scope.removeLabel = function(note, label) {
    console.log("remove Label ", note);
    console.log("remove label label ", label);
    var url = "http://localhost:8080/FundooNotes/" + "removelabels/" + label.labelId;
    userService.postmethod(note, url).then(function successCallback(response) {
      console.log("response successfully remove label from note");
      $scope.getAllNotes();
    }, function errorCallback(response) {
      console.log("response error");
      // $scope.getAllNotes();
    });

  }

  $scope.removeReminder = function(note) {
    note.reminder = null;
    var url = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
    userService.putmethod(note, url).then(function successCallback(response) {
      $scope.getAllNotes();
    }, function errorCallback(response) {
      $scope.getAllNotes();
    });
  }

  $scope.labelDailogBox = function(ev, s) {
    console.log("event ", ev);
    $mdDialog.show({
      locals: {
        s: s
      },
      templateUrl: 'templates/LabeldialogBox.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      controller: labelDialogController,
      clickOutsideToClose: true,
      fullscreen: $scope.customFullscreen
    });
  };

  function labelDialogController($scope, $mdDialog, s) {
    console.log("label controller");
    $scope.getAllLabels = function() {
      var url = "http://localhost:8080/FundooNotes/" + "getallabels";
      userService.getMethod(url).then(function successCallback(response) {
        $scope.getLabels = response.data;
        console.log("latest label ", $scope.getLabels);
      }, function errorCallback(response) {
        console.log("in get label service error ", response.data);
      });
    }

    $scope.getAllLabels();

    $scope.createlabel = function() {
      var labelNAme = $scope.labelName;
      if (labelNAme != '') {
        console.log("label name " + labelNAme);
        console.log("will not create");

        var label = {
          labelName: $scope.labelName
        }
        var url = "http://localhost:8080/FundooNotes/" + "createlabel";
        userService.postmethod(label, url).then(function successCallback(response) {
          $scope.getAllLabels();
          s.getAllNotes();
          s.getAllabels();
        }, function errorCallback(response) {
          alert("label already exist");
          console.log("create label ", response.data);
        });
      } else {
        alert("label Name should not be null");
      }
    }
    $scope.hide = function() {
      $mdDialog.hide();
    }

    $scope.deleteLabel = function(label) {
      var url = "http://localhost:8080/FundooNotes/" + "deletelabel/" + label.labelId;
      userService.deleteMethod(url).then(function successCallback(response) {
        $scope.getAllLabels();
        s.getAllNotes();
        s.getAllabels();
      }, function errorCallback(response) {});
    }

    $scope.editLabel = function(label) {
      this.editlabel = true;
    }

    $scope.editedLabel = function(label) {
      var url = "http://localhost:8080/FundooNotes/" + "updatelabel/" + label.labelId;
      userService.putmethod(label, url).then(function successCallback(response) {
        this.editlabel = false;
        $scope.getAllLabels();
      }, function errorCallback(response) {});
    }
  }



  $scope.uploadImage = function(note) {
    console.log("note image ", note);
    document.addEventListener('change', function(ev) {
      console.log("addEventListener ", ev.target.files);
      var files = ev.target.files;
      var File = files[0];
      console.log("singlefile ", File.name);
      var fd = new FormData();
      fd.append("file", File);
      console.log("appended file ", fd);
      var url = "http://localhost:8080/FundooNotes/" + "upload";
      userService.imageUploadMethod(fd, url).then(function successCallback(response) {
        $scope.imageUrl = response.data.message;
        if (note == undefined) {
          $scope.imageUrl = response.data.message;
        } else {
          note.image = $scope.imageUrl;
          console.log("after upade iamge 2345678654 ", note);
          console.log("response successfully ", $scope.imageUrl);
          var url2 = "http://localhost:8080/FundooNotes/" + "updatenotes/" + note.noteid;
          userService.putmethod(note, url2).then(function successCallback(response) {
            console.log("putemethod ", response.data);
            $scope.getAllNotes();
          }, function errorCallback(response) {
            $scope.getAllNotes();
          });
        }
      }, function errorCallback(response) {
        console.log("erro ", response);
      });

    })
  }

  $scope.showlistView = true;
  $scope.showgridView = false;
  var elements = document.getElementsByClassName("cards");

  $scope.listView = function() {
    for (i = 0; i < elements.length; i++) {
      elements[i].style.width = "900px";
    }
    $scope.showlistView = false;
    $scope.showgridView = true;
  }

  $scope.gridView = function() {
    for (i = 0; i < elements.length; i++) {
      elements[i].style.width = "240px";
    }
    $scope.showlistView = true;
    $scope.showgridView = false;
  }


  $scope.userAccountPanel = function(ev, templatePage) {
    console.log("panel reminder ", templatePage);
    $scope.currentDate = new Date();
    var position = $mdPanel.newPanelPosition()
      .relativeTo(ev.target)
      .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);
    console.log("position of panel ", position);
    var config = {
      locals: {
        OuterScpe: $scope
      },
      attachTo: angular.element(document.body),
      templateUrl: 'templates/' + templatePage + '.html',
      controller: logOutCard,
      position: position,
      openFrom: ev,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: false,
      zIndex: 10,
    };
    $mdPanel.open(config);
  }

  function logOutCard($scope, mdPanelRef, OuterScpe, $mdDialog) {

    $scope.user = JSON.parse(localStorage.getItem('userDto'));
    $scope.userName = $scope.user.username;
    console.log("inside logout card controller ", $scope.userName);

    $scope.logOut = function() {
      $state.go('login');
      localStorage.clear();
    }
    $scope.ProfileImage = function(event) {
      $mdDialog.show({
        locals: {
          OuterScope: $scope
        },
        templateUrl: 'templates/ProfileUpaload.html',
        parent: angular.element(document.body),
        targetEvent: event,
        controller: profilDialogController,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen
      })
    };

    function profilDialogController($scope, $timeout,$mdDialog) {
      $scope.myImage = '';
      $scope.myCroppedImage = '';
      $scope.userdto = JSON.parse(localStorage.getItem('userDto'));

      function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n) {
          u8arr[n - 1] = bstr.charCodeAt(n - 1)
          n -= 1
        }
        return new File([u8arr], filename, {
          type: mime
        });
      }

      var file;
      var handleFileSelect = function(evt) {
        file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
          $scope.$apply(function($scope) {
            $scope.myImage = evt.target.result;
          });
        };
        reader.readAsDataURL(file);
        console.log(file);
      };
      $timeout(function() {
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
      }, 1000, false);

      $scope.cropeImage = function(image) {
        var newfile = dataURLtoFile(image, file.name);
        var fd = new FormData();
        fd.append("file", newfile);
        var url = "http://localhost:8080/FundooNotes/" + "upload";
        userService.imageUploadMethod(fd, url).then(function successCallback(response) {
          $scope.imageUrl = response.data.message;
          var url = "http://localhost:8080/FundooNotes/" + "upadteuserprofile";
          var userdto = $scope.userdto;
          userdto.profile = $scope.imageUrl;
          userService.postmethod(userdto, url).then(function successCallback(response) {
            localStorage.setItem("userDto", JSON.stringify(response.data.userdto));
            $scope.profile = response.data.userdto.profile;
          }, function errorCallback(response) {});
        }, function errorCallback(response) {
        });
      }

      $scope.hide = function() {
        $mdDialog.hide();
      }
    }

    $scope.getEmageByName=function(name){
     var data=OuterScpe.getInitials(name);
     return data;
   }
    $scope.close = function() {
      mdPanelRef && mdPanelRef.close();
    };

  };

  $scope.getInitials = function(name) {
  var canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  canvas.width = '96';
  canvas.height = '96';
  document.body.appendChild(canvas);
  var context = canvas.getContext('2d');
  context.fillStyle = "#999";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "50px Arial";
  context.fillStyle = "#ccc";
  var first;
  first = name.charAt(0);
  var initials = first;
  context.fillText(initials.toUpperCase(), 25, 60);
  var data = canvas.toDataURL();
  document.body.removeChild(canvas);
  return data;
}
$scope.menubar=true;
$scope.colorChange=function(){
  console.log("color change of toolbar");
  document.getElementById('wholeToolbar').style.backgroundColor="blue";
  document.getElementById('searchBar').style.backgroundColor="white";
  document.getElementById('searchBar2').style.backgroundColor="white";
$scope.backToolBar=true;
$scope.menubar=false;
}

  $scope.LabelState = function(labelNAme) {
    console.log("created label state ", labelNAme.labelName);

    $state.go('home.label', {
      name: labelNAme.labelName
    });
  }

  $scope.labelName = 'Spring';
  $scope.notes = function() {
    $state.go('home.dashboard');
  }

   // $scope.colorToolBar=function(){
   //   var url = $location.path().split('/');
   //     $scope.secondParameter = url[3];
   //   console.log("state color chnage  ",url);
   //   if($scope.secondParameter!='dashboard'){
   //     document.getElementById('wholeToolbar').style.backgroundColor="rgb(96, 125, 139)";
   //   }
   // }
   // $scope.colorToolBar();
  $scope.archiveState = function() {
    //  document.getElementById('wholeToolbar').style.backgroundColor="rgb(96, 125, 139)";
    //  document.getElementById('searchBar').style.background="transparent";
    //  document.getElementById('searchBar2').style.background="transparent";
        //  background: transparent;

    $state.go('home.archive');
  }

  $scope.trashState = function() {
    $state.go('home.trash');
  }

  $scope.reminderState = function() {
    $state.go('home.reminder');
  }

  $scope.trashmore = [{
    "option": 'Delete forever'
  }, {
    "option": 'Restore'
  }];

  $scope.boxList = [
    [{
      color: '#ffff'
    }, {
      color: '#5ed6d6'
    }, {
      color: '#d88259'
    }],
    [{
      color: '#f194bb'
    }, {
      color: '#c8f390'
    }, {
      color: '#a4f390'
    }],
    [{
      color: '#8193e8'
    }, {
      color: '#b7d4e8'
    }, {
      color: '#7fc3f3'
    }],
    [{
      color: '#e6ce77'
    }, {
      color: '#af6060'
    }, {
      color: '#c17ff3'
    }]
  ];


  $scope.moreList = [{
    "option": 'Delete note'
  }, {
    "option": 'Change labels'
  }];


  $scope.showSimpleToast = function(msg) {
    $mdToast.show(
      $mdToast.simple()
      .textContent(msg)
      .position('bottom left')
      .hideDelay(3000)
    );
  };

});
