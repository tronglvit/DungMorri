function expandCourses(){console.log("xem thêm khóa học mobile"),$(".mobile-content").css("height","auto"),$(".view-more-courses").css("display","none")}var firstTimeVisit=getCookie("first_time_visit_today");null!=firstTimeVisit&&0!=firstTimeVisit||($("#open-featured-popup").click(),setCookie("first_time_visit_today",1,1));