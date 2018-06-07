var app = angular.module('domainSearch', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'mgcrea.ngStrap'
]);

app.controller('DomainListController', function ($scope, DomainService, $timeout) {

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
    
    $scope.runCrawler = function() {
        $scope.domains.search = null;
        $scope.domains.domains = [];
        $scope.domains.isLoading = true;
        $scope.domains.runCrawler();
        
        $timeout(function(){
            
            $scope.domains.isLoading = false;
            $scope.domains.crawlerStarted = false;
            $scope.domains.search = null;
            $scope.domains.page = 1;
            $scope.domains.loadDomains();
            
        }, 5 * 60 * 1000);
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
        'ordering': '-valuation',
        'crawlerStarted': false,
        
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
                
                self.request = $http.get('/q?search=' + self.search + '&page=' + self.page + '&order=' + self.ordering);
                
                self.request.then(function(result) {
                    self.domains = result.data;
                    if (!result.data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }    
        },        
        
        'runCrawler': function() {
            self.isLoading = true;
            self.request = $http.get('/run-crawler');
            
            self.request.then(function(result) {
                if (result.data.start == "success") {
                    self.crawlerStarted = true;
                }
            });
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

