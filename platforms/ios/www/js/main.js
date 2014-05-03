;define('main', ['appframework', 'appframeworkui', 'views/login/LoginView', 'core/DataManager', 'i18n!nls/nav', 'routers/approuter', 'core/Constants', 'i18n!nls/miscellaneous'],

    (function($, $ui, login, dataManager, nav, router, Constants, miscellaneous){

    var isLoginDisabled;

    var onDeviceReady = function(){

        var platform, devicePlatform;

        if(window.device && window.device.available){

            devicePlatform = window.device.platform;

        }else{

            devicePlatform = 'iOS';

        }

        switch (true){

            case  devicePlatform == 'Android':
            platform = 'android';
            break;

            case  devicePlatform == 'BlackBerry':
            platform = 'bb';
            break;

            case  devicePlatform == 'WinCE':
            platform = 'win8';
            break;

            case  devicePlatform == 'iOS':
            window.device.version >= 7.0 ?  platform = 'ios7' : platform = 'ios';
            break;

            default:
            platform = 'ios7';
            break;

        }

        $('#afui').get(0).className = platform;

        try{

            var networkState = navigator.connection.type;
            if(networkState == Connection.NONE){

                navigator.notification.alert(miscellaneous.connectionRequired);
                isLoginDisabled = true;

            }

        }catch (error){

            console.log(error);
            isLoginDisabled = true;

        }

        $(document).ready(function(){

            navigator.globalization.getPreferredLanguage(onSystemLanguage, onGlobalizationError);
            addEventListener('localePreferenceChanged', onLocalePreferenceChanged);

            require(['utils/SectionsTitleFactory'], function(factory){

                factory.init($('#main'), $('#forgot-pwd'), $('#courses'), $('#reports'), $('#settings'));
                launchUI();

            });

        });

    };

    var launchUI = function(){

        $ui.splitview = false;

        $ui.launch();
        $ui.showBackButton = false;

        $ui.disableSideMenu();
        $ui.toggleNavMenu();

        $('#courses-link').text(nav.courses);
        $('#reports-link').text(nav.reports);

        $('#settings-link').text(nav.settings);
        $('#settings').bind('loadpanel', loadSettingsModule);

        $('#logout-link').text(nav.logout).bind('touchend', doLogout);

    };

    var loadSettingsModule = function(evt){

        require(['views/settings/SettingsView'], function(settings){

            settings.init();

        });

    };

    var doLogout = function(evt){

        evt.preventDefault();
        evt.stopPropagation();

        $.ui.showMask(miscellaneous.loggingout);

        var user = dataManager.getUser();

        $.ajax({

            url: Constants.API_URL,
            type: 'post',
            data: JSON.stringify({'details': {'action': 'logout', 'userid': user.id, 'key': user.getUsername, 'token': user.token}}),
            success: function( data ) {

                var currentData = JSON.parse(data);

                if(currentData.success === true){

                    $.ui.hideMask();
                    $.ui.loadContent('main', false, false, Constants.PANELS_DIRECTION);

                }

            },
            error: function(xhr, error){

                console.log(arguments);

            }
        });

    };

    var onLocalePreferenceChanged = function(evt){

        localStorage.setItem('userLocale', evt.detail.value.toLocaleLowerCase());
        location.reload();

    };

    var onSystemLanguage = function(locale){

        console.log('onPreferredLanguage', locale.value);

        dataManager.init();
        router.init();

        login.init(localStorage.getItem('userLocale') || locale.value, isLoginDisabled);

    };

    var onGlobalizationError = function(error) {

        navigator.notification.alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n', null);

    };

    var init = function(){

        console.log($);
        document.addEventListener('deviceready', onDeviceReady, false);

    };

    return{

        init: init

    };


}));