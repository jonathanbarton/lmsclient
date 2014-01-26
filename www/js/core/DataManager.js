;define('core/DataManager', [], (function(){

    var that = this;
    var events = {USER_LOGGED_IN: 'onUserLoggedIn', COURSE_OPENED: 'onCourseOpened', PUSH_NOTIFICATION_STATUS: 'onPushNotificationStatus'};
    var user, currentCourse, pushNotification;

    var onUserLoggedIn = function(evt) {

        evt.stopPropagation();

        user = evt.detail.user;

    };

    var onCourseOpened = function(evt) {

        evt.stopPropagation();

        currentCourse = evt.detail.course;

    };

    var onPushNotificationStatus = function(evt) {

        evt.stopPropagation();

        pushNotification = evt.detail.usePushNotification;

    };

    var init = function(){

        that.addEventListener(events.USER_LOGGED_IN, onUserLoggedIn);
        that.addEventListener(events.COURSE_OPENED, onCourseOpened);
        that.addEventListener(events.PUSH_NOTIFICATION_STATUS, onPushNotificationStatus);

    };

    var dispose = function(){

        that.removeEventListener(events.USER_LOGGED_IN, onUserLoggedIn);
        that.removeEventListener(events.COURSE_OPENED, onCourseOpened);
        that.removeEventListener(events.PUSH_NOTIFICATION_STATUS, onPushNotificationStatus);

    };

    return{

        getUser: function(){return user;},
        getCourse: function(){return currentCourse;},
        getPushNotifications: function(){return pushNotification;},
        dispose: dispose,
        init: init,
        events: events

    }

}));