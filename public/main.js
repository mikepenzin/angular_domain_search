var app = angular.module('domainSearch', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'mgcrea.ngStrap'
]);

app.controller('DomainListController', function ($scope, DomainService) {

    $scope.search = '';
    $scope.order = '';
    $scope.domains = DomainService;

    $scope.loadMore = function () {
        $scope.domains.loadMore();
    };
    
    $scope.showAll = function() {
        $scope.domains.search = null;
        $scope.domains.page = 1;
        $scope.domains.loadDomains();
    }
});

app.service('DomainService', function ($q, $rootScope, $http) {

    var self = {
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'request': null,
        'domains': [],
        'search': null,
        'ordering': 'domain',
        
        'doSearch': function () {
            self.hasMore = true;
            self.page = 1;
            self.domains = [];
            self.loadDomains();
        },
        
        'doOrder': function () {
            self.hasMore = true;
            self.page = 1;
            self.domains = [];
            self.loadDomains();
        },
        
        'loadDomains': function() {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                
                self.request = $http.get('https://angular-domain-search-penzin.c9users.io/q?search=' + self.search + '&page=' + self.page + '&order=' + self.ordering);
                
                self.request.then(function(result) {
                    self.domains = result.data;
                    if (!result.data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }    
        },        

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

