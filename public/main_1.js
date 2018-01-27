var app = angular.module('codecraft', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate'
]);

app.config(function ($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Token a89633996340aa043e4cbdb4c66ad1ff07372361'
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
});

app.factory('Contact', function ($resource) {
    return $resource('https://api.codecraft.tv/samples/v1/contact/:id/', {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

app.controller('PersonDetailController', function ($scope, ContactService) {
    $scope.contacts = ContactService;

    $scope.save = function () {
        $scope.contacts.updateContact($scope.contacts.selectedPerson);
    };

    $scope.remove = function () {
        $scope.contacts.removeContact($scope.contacts.selectedPerson);
    };
});

app.controller('PersonListController', function ($scope, $modal, ContactService) {

    $scope.search = '';
    $scope.order = 'email';
    $scope.contacts = ContactService;

    $scope.loadMore = function () {
        $scope.contacts.loadMore();
    };

    $scope.showCreateModal = function(){
        $scope.contacts.selectedPerson = {};
        $scope.createModal = $modal({
            scope: $scope,
            template: 'templates/modal.create.tpl.html',
            show: true
        })
    };

    $scope.createContact = function(){
        $scope.contacts.createContact($scope.contacts.selectedPerson)
            .then(function(){
                $scope.createModal.hide();
            })
    };

    $scope.$watch('search', function (newVal, oldVal) {
        if (angular.isDefined(newVal)) {
            $scope.contacts.doSearch(newVal);
        }
    });

    $scope.$watch('order', function (newVal, oldVal) {
        if (angular.isDefined(newVal)) {
            $scope.contacts.doOrder(newVal);
        }
    });

});

app.service('ContactService', function (Contact, $q, toaster) {

    var self = {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'isDeleting': false,
        'selectedPerson': null,
        'persons': [],
        'search': null,
        'doSearch': function (search) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.search = search;
            self.loadContacts();
        },
        'doOrder': function (order) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.ordering = order;
            self.loadContacts();
        },
        'loadContacts': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    'page': self.page,
                    'search': self.search,
                    'ordering': self.ordering
                };

                Contact.get(params, function (data) {
                    console.log(data);
                    angular.forEach(data.results, function (person) {
                        if(person.photo == null){
                            console.log(person.photo);
                            person.photo = 'http://www.filecluster.com/howto/wp-content/uploads/2014/07/User-Default.jpg';
                        }
                        self.persons.push(new Contact(person));
                    });

                    if (!data.next) {
                        self.hasMore = false;
                    }
                    self.isLoading = false;
                });
            }
        },

        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadContacts();
            }
        },

        'updateContact': function (person) {
            self.isSaving = true;
            // Method 2 to update contact
            person.$update().then(function () {
                console.log('Saved!');
                self.isSaving = false;
                toaster.pop('success', 'Updated ' + person.name);
            });
            // Method 1 to update contact
            //Contact.update(person).$promise.then(function(){
            //    console.log('Saved!');
            //    self.isSaving = false;
            //});
        },

        'removeContact': function (person) {
            self.isDeleting = true;
            person.$remove().then(function () {
                console.log('Removed!');
                self.isDeleting = false;
                var index = self.persons.indexOf(person);
                self.persons.splice(index, 1);
                self.selectedPerson = null;
                toaster.pop('success', 'Removed ' + person.name);
            });
        },

        'createContact': function(person){
            var d = $q.defer();
            self.isSaving = true;
            Contact.save(person).$promise.then(function(){
                console.log('Created!');
                self.isSaving = false;
                self.selectedPerson = null;
                self.hasMore = true;
                self.page = 1;
                self.persons = [];
                self.loadContacts();
                toaster.pop('success', 'Created ' + person.name);
                d.resolve();
            });
            return d.promise;
        }
    };

    self.loadContacts();

    return self;

});