var app = angular.module('domainSearch', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate'
]);

app.controller('DomainListController', function ($scope, DomainService) {

    $scope.search = '';
    $scope.order = '';
    $scope.domains = DomainService;

    $scope.loadMore = function () {
        $scope.domains.loadMore();
    };

    // $scope.$watch('search', function (newVal, oldVal) {
    //     if (angular.isDefined(newVal)) {
    //         $scope.domains.doSearch(newVal);
    //     }
    // });

    // $scope.$watch('order', function (newVal, oldVal) {
    //     if (angular.isDefined(newVal)) {
    //         $scope.domains.doOrder(newVal);
    //     }
    // });
});

app.service('DomainService', function ($q, $rootScope, toaster, $http) {

    var self = {
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'request': null,
        'domains': [],
        'search': null,
        'ordering': null,
        
        'doSearch': function () {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.loadDomains();
        },
        'doOrder': function () {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.loadDomains();
        },
        
        'loadDomains': function() {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    'page': self.page,
                    'search': self.search,
                    'ordering': self.ordering
                }; 
                
                console.log(self.search, self.page);
                
                self.request = $http.get('https://expired-domains-search.herokuapp.com/q?search=' + self.search + '&page=' + self.page);
                
                self.request.then(function(result) {
                    
                    self.domains = result.data;
                    console.log(result.data);
                    
                    if (!result.data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }    
        },        
        
        // 'loadContacts': function () {
        //     if (self.hasMore && !self.isLoading) {
        //         self.isLoading = true;

        //         var params = {
        //             'page': self.page,
        //             'search': self.search,
        //             'ordering': self.ordering
        //         };

        //         Contact.get(params, function (data) {
        //             console.log(data);
        //             angular.forEach(data.results, function (person) {
        //                 if(person.photo == null){
        //                     console.log(person.photo);
        //                     person.photo = 'http://www.filecluster.com/howto/wp-content/uploads/2014/07/User-Default.jpg';
        //                 }
        //                 self.persons.push(new Contact(person));
        //             });

        //             if (!data.next) {
        //                 self.hasMore = false;
        //             }
        //             self.isLoading = false;
        //         });
        //     }
        // },

        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadDomains();
            }
        },
        
        'watchFilters': function() {
            $rootScope.$watch(function(){
                return self.search;
            }, function(newVal){
                if(angular.isDefined(newVal)) {
                    self.doSearch();
                }
            });
            $rootScope.$watch(function () {
                return self.ordering;
            }, function (newVal) {
                if(angular.isDefined(newVal)) {
                    self.doOrder();
                }
            });
        }    
    };

    self.loadDomains();
    self.watchFilters();
    
    return self;

});

