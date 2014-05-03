;define('views/login/LoginView', ['appframework', 'controllers/Login', 'i18n!nls/login', 'core/Constants', 'utils/ConfigurationManager'],
    (function($, controller, loginMessages, Constants, config){

        var isDisabled,
            $username, $password, $domain,
            $form, $forgotPassword, $languageSelector;

        var onLogin = function(evt){

            evt.preventDefault();

            console.log('isDisabled', isDisabled)

            if(!isDisabled){

                var username, password;
                username = $username.val();
                password = $password.val();

                controller.doLogin(username, password);

            }

        };

        var doShowHideLoader = function(show, msg, callBack, panel){

            if(show == true){

                showMask(msg);

            }else{

                $.ui.hideMask();

            }

            if(callBack){

                $('#' + panel).bind('loadpanel', function(e){

                    callBack();
                    $('#' + panel).unbind('loadpanel', arguments.callee);

                });

            }

            if(panel){

                $.ui.loadContent(panel, false, false, Constants.PANELS_DIRECTION);

            }

        };

        var showMask = function(msg){

            if(msg && msg != ''){

                $.ui.showMask(msg);

            }else{

                $.ui.showMask('Authenticating...');

            }

        };

        var doGoNext = function(){

            //TODO handle the app routing since here
            if(!$.ui.isSideMenuEnabled()){

                $.ui.enableSideMenu();

                if($('#menu').hasClass('tabletMenu')){

                    // TODO Discuss with the customer is the menu is needed on tablets
                    // $('#menu.tabletMenu')

                }

            }

            $('#menubadge').css('visibility', 'visible');
            config.saveConfig('defaulturl', $domain.val());

        };

        var loginIssue = function(msg){

            return document.getElementById($.ui.popup(msg).id);

        };

        var onFormDataChange = function(evt) {

            var $errorMessages = $('#website').siblings($('.unhappyMessage'));

            $errorMessages.each(function(){

                $(this).addClass('removeErrorMessage');

            });

        };

        var init = function(lang, status){

            isDisabled = status;

            controller.init(this);

            $('#main').attr('title', loginMessages.welcome);

            $username           = $('#username');
            $password           = $('#password');
            $domain             = $('#website');
            $languageSelector   = $('#language');
            $forgotPassword     = $('#recover-password');

            $form               = $('#login-form');

            $username.attr('placeholder', loginMessages.username);
            $password.attr('placeholder', loginMessages.password);
            $domain.attr('placeholder', loginMessages.domain);

            $forgotPassword.text(loginMessages.forgot);
            $($form).find('#do-login').text(loginMessages.submit);

            require(['utils/SelectParser'], function(selectParser){

                selectParser.init($languageSelector);
                selectParser.update(lang || 'en')

            });

            require(['libs/happy/happy'], function(happy){

                controller.initValidation($form);

            });

            $username.bind('focus', onFormDataChange);
            $password.bind('focus', onFormDataChange);
            $domain.bind('focus', onFormDataChange);

            $form.bind('submit', onLogin);
            $forgotPassword.bind('tap', controller.recoverPassword);
            $languageSelector.bind('change', controller.changeLanguage);

            require(['core/BackButtonManager'], (function(backManager){

                //  function(toDisable, toEnable)
                backManager.init($('#courses'),
                                [$('#reports'), $('#settings'), $('#logout'), $('#forgot-pwd'), $('#course-details')]);

            }));

        };

        var dispose = function(){

            $form.unbind('submit', onLogin);
            $forgotPassword.unbind('tap', controller.recoverPassword);

            $username.val('');
            $password.val('');
            $domain.val('');

        };


        return {

            init: init,
            dispose: dispose,
            showHideLoader: doShowHideLoader,
            loginIssue: loginIssue,
            goNext: doGoNext,
            getUsername: function(){return $username;},
            getDomain: function(){return $domain.val();},
            getDomainItem: function(){return $domain;}

        }

    }));