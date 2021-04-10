var webUrl = window.location.origin;

app.controller('loginctrl', function($scope, $http){
    if(localStorage.length>0){
        window.location.href = webUrl+"/myprofile";			
    }
    $scope.login = function(){
        console.log($scope.logindata);
        $http({
            url: webUrl+"/login",
            method:"POST",
            data:$scope.logindata,
            headers:{"Content-Type":"application/json"}
        }).then(function successCallback(res){
            localStorage.setItem("id", res.data[0]._id);
            localStorage.setItem("uname", res.data[0].username);
            // localStorage.setItem("totalcount", 0)
            location.reload();
            // localStorage.clear();
            // console.log(localStorage);
        }, function errorCallback(err){
            console.log(err);
        });
    }
});