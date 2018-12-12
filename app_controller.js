var data = [];

var App = angular.module('ngApp',[]);


App.factory('Post', ['$http','$q', function($http,$q){
	return {
		fetchAllPosts: function(){
			return $http.get('http://localhost:9999/index.html')
			.then(
				function(response){
					if (response.status === 200){
						return response.data;
					}	
				},
				function(errResponse){
					console.error('Error of fetching posts');
					return $q.reject(errResponse);
				}
			);
		},

		createPost: function(post){
			return $http.post('http://localhost:9999/index.html',post)
			.then(
				function(response){
					if (response.status === 200){
						return response.data;
					}
				},
				function(errResponse){
					console.error('Error of creating post');
					return $q.reject(errResponse);	
				}
			);
		},
		
		viewPost: function(post,id){
			return $http.get('/index.html'+id, post)
			.then(
				function(response){
					if (response.status === 200){
						return response.data;
					}
				},
				function(errResponse){
					console.error('Error of viewing post');
					return $q.reject(errResponse);	
				}
			);
		},
	};
}]);


App.controller('AppController', ['$scope', 'Post', '$filter', '$http', function($scope, Post, $filter, $http){
	$scope.post={id:null,Title:'',Post:'',Gender:'',Age:'',Date_Post:null};

    var today = new Date();
	$scope.today = today.toISOString();

	$scope.posts = data;
	
	$scope.fetchAllPosts = function(){
		Post.fetchAllPosts()
		.then(
			function(dt){
				$scope.posts = dt;
			},
			function(errResponse){
				console.error('Error of fetching posts');
			}
		);
	};

	$scope.createPost = function(post){
		Post.createPost(post)
		.then(
			$scope.fetchAllPosts,
			function(errResponse){
				console.error('Error of creating post');
			}
		);
	};

	$scope.viewPost = function(post,id){
		Post.viewPost(post,id)
		.then(
			$scope.fetchAllPosts,
			function(errResponse){
				console.error('Error of viewing post');
			}
		);
	};	

	$scope.fetchAllPosts();
		
	$scope.submit = function(){
		if ($scope.post.id === null){
                        $scope.post.Date_Post = $filter('dateFilter')(new Date());

		
			$scope.calculateAge = function calculateAge(birthday) {
    				var ageDifMs = Date.now() - birthday.getTime();
    				var ageDate = new Date(ageDifMs);
    				return Math.abs(ageDate.getUTCFullYear() - 1970);
			}

			$scope.calc_age = $scope.calculateAge($scope.post.Age);
			$scope.post.Age = angular.copy($scope.calc_age);

			for (var i = 0; i < $scope.posts.length; i++){
			$scope.id_post = $scope.posts.length;
			$scope.post.id = angular.copy($scope.id_post);
			}
			
  			$scope.greeting='Greeting! Your post is adding now!';

			console.log('Saving new post', $scope.post);
			$scope.createPost($scope.post);
			$scope.put();

		}else{
		$scope.reset();
		}
	};

	$scope.reset = function(){
		$scope.post={id:null,Title:'',Post:'',Gender:'',Age:'',Date_Post:''};
		$scope.greeting = '';
		$scope.myForm.$setPristine();
		$scope.myForm.$setUntouched();
	};


	$scope.view = function (id){
		console.log('id to be view', id);
		for (var i = 0; i < $scope.posts.length; i++){
			if ($scope.posts[i].id === id){
				$scope.post = angular.copy($scope.posts[i]);
			}
		}
	};


	$scope.put = function (){
		$scope.posts.push($scope.post);	
	};
	
	//sorting
	$scope.sort_posts = {sorting_param: null, sorting_mode:null};
	$scope.sort_params = {};
	$scope.sorting='';

	$scope.run_sort = function(sort_posts) {
	$scope.sort_params = angular.copy(sort_posts);
	$scope.sort_param = $scope.sort_params.sorting_param;
	$scope.sort_mode = $scope.sort_params.sorting_mode;

	if ($scope.sort_mode == 'asc'){
			$scope.sorting=$scope.sort_param;
		}else{
			$scope.sorting='-'+$scope.sort_param;
		}
	};


	$scope.reset_sort = function(){
		$scope.sort_posts = {sorting_param: null, sorting_mode:null};
		$scope.sort_params = {sorting_param: null, sorting_mode:null};
		$scope.sort_param = null;
  		$scope.sort_mode = null;
		$scope.sorting = null;
		$scope.myForm.$setPristine();
		$scope.myForm.$setUntouched();
	};
	//sorting

	
	//filtering
	$scope.filter_posts = {min_age: null, max_age:null, gender:''};
	$scope.filter_params = {};
	
   	$scope.run_filter = function(filter_posts) {
	$scope.filter_params = angular.copy(filter_posts);
	$scope.min_age = $scope.filter_params.min_age;
	$scope.max_age = $scope.filter_params.max_age;
	$scope.gender =$scope.filter_params.gender;
	
	$scope.filterAge = function(val) {
  	return (val.Age > $scope.min_age && val.Age < $scope.max_age);
	};

	};


	$scope.reset_filter = function(){
		$scope.filter_posts = {min_age: null, max_age:null, gender:''};
		$scope.filter_params = {min_age: null, max_age:null, gender:''};
		$scope.filterAge = function(val) {
  		return (val.Age > 0 && val.Age < 350);
		};
		$scope.gender = '';
		$scope.myForm.$setPristine();
		$scope.myForm.$setUntouched();
	};
	//filtering

}]);

App.filter('dateFilter', function() {
     function calculateDate(date) {
         date = new Date(date);
         var year = date.getFullYear();
         var month = date.getMonth()+1;
         var day = date.getDate();
         return year+'-'+month+'-'+day;
     }

     return function(date) { 
           return calculateDate(date);
     }; 
});
