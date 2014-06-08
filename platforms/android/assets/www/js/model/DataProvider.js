;define('model/DataProvider', ['appframework', 'core/Constants', 'i18n!nls/miscellaneous'], (function($, Constants, miscellaneous){

    var failureHandlerActive, currentApiURL;
    var current;

    var onAppOffline = function(evt){

        navigator.notification.alert(miscellaneous.connectionRequired, function(){

            $.ui.loadContent('main', false, false, Constants.PANELS_DIRECTION);

        });

    };

    var initFailureHandler = function(){

        failureHandlerActive = true;

        document.removeEventListener('offline', onAppOffline);
        document.addEventListener('offline', onAppOffline, false);

    };

    var setCurrentApiURL = function(value){

        currentApiURL = value;

    };

    var fetchData = function(url, params, successHandler, errorHandler, rootURL){

        if(url === current)return;

        $.ajax({

            url: (rootURL || currentApiURL) + '/api/' + url,
            type: 'post',
            data: params,
            success: function(data){

                successHandler(data);
                current = '';

            },
            error:function(xhr, error){

                errorHandler(xhr, error);
                current = '';

            }

        });

        if(!failureHandlerActive){

            initFailureHandler();

        }

        current = url;

    };

    var fetchDataWithProxy = function(params, successHandler, errorHandler){

        if(params.details.action === current)return;

        $.ajax({

            url: currentApiURL + Constants.API_URL,
            type: 'post',
            data: params,
            success: function(data){

                successHandler(data);
                current = '';

            },
            error:function(xhr, error){

                errorHandler(xhr, error);
                current = '';

            }

        });

        if(!failureHandlerActive){

            initFailureHandler();

        }

        current = params.details.action;

    };

    return {

        fetchData: fetchData,
        fetchDataWithProxy: fetchDataWithProxy,
        setCurrentApiURL: setCurrentApiURL

    }

}));