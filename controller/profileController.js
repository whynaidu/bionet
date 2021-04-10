var webUrl = window.location.origin;

function getLinkValue(){
    return localStorage.getItem('totalcount');
}

app.controller('profilecontroller', function ($scope) {    
    $scope.SelectFile = function (e) {
        var reader = new FileReader();
            reader.onload = function (e) {
                $scope.PreviewImage = e.target.result;
                $scope.$apply();
            };
            reader.readAsDataURL(e.target.files[0]);
        };
    });
   
app.controller('profilecontroller', function($scope, $http){   
    $scope.updateLinkInfo = function(){
        $scope.updatelink.uid = localStorage.getItem("id");
        console.log($scope.updatelink);
        $http({
            url:webUrl+"/updateLinkInfo",
            method:"POST",
            data:$scope.updatelink,
            headers:{
                "Content-type":"application/json"
            }
        }).then(function(res){
            console.log(res);
        }, function(err){
            console.log(err);
        });

    }
    $scope.addLink= function(){
        $scope.addLink.uid = localStorage.getItem("id");
            console.log($scope.addLink);
            $http({
                url:webUrl+"/addLink",
                method:"POST",
                data:$scope.addLink,
                headers:{
                    "Content-type":"application/json"
                }
            })
        }

        $scope.passLinkInfo = function(id, title, url){
            console.log(id+" : "+title+" : "+url);
            $scope.updatelink = {
                lid:id,
                linkTitle:title,
                url:url
            };
        }
        
        if(localStorage.length==0){
            window.location.href = webUrl+"/login";			
        } else {
            $scope.loggedInUserName = localStorage.uname;
            $scope.loggedInUserId = localStorage.id;
            $http({
                url:webUrl+"/getuserLinks/"+$scope.loggedInUserId,
                method:"GET"
            }).then(function(res){
                console.log(res);
                $scope.links = res.data[0].links;
                var linkCount = 0;
                res.data[0].links.forEach(link => {
                    linkCount += link.clicks;
                });
                localStorage.setItem("totalcount", linkCount);
            }, function(err){
                console.log(err);
            });
        }
        $scope.logout = function() {
        localStorage.clear();
        location.reload();
    }
});

   