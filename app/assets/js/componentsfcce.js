Vue.component('comment-fb', {
    template: '<div class="fb-comments" data-width="100%" :data-href="url" data-numposts="8"></div>',
    props: ['url']

})
Vue.component('item-course', {

    template: `<div class="courses-linear">
        <div class="grid-item-course" v-for="lesson in lessons">
            <a :href="url + '/khoa-hoc/'+ course + '/' + lesson.id + '-' + lesson.SEOurl">
                <img class="lazyload course-thumbnail" :src="url + '/assets/img/video-thumbnail-default.jpg'" :data-src="url + '/cdn/lesson/small/' + lesson.avatar_name" />
            </a>
            <div class="course-detail">
                <a class="name" :href="url + '/khoa-hoc/'+ course + '/' + lesson.id + '-' + lesson.SEOurl">
                    <b style="-webkit-box-orient: vertical;">{{ lesson.name }}</b>
                </a>
                <img :src="url + '/assets/img/teacher-icon.png'"><span class="arthor">{{ lesson.author_name }}</span>
            </div>
        </div>
    </div>`,

    props: ['course', 'lessons'],

    data: function () {
        return {
            url: window.location.origin
        };
    }

})
Vue.component("ht-select", {
  template: `
  <div>
    <select class="ht-select" v-model="selected">
      <option v-for="opt in options" v-bind:value="opt.value">{{ opt.text }}</option>
    </select>
  </div>
  `,
  props: {
    init_options: {
      required: true
    },
    init_selected: null,
    init_other_value: null,
  },
  watch: {
    selected: function(new_value, old_value) {
      if (new_value !== this.init_other_value) {
        this.$emit("change", new_value);
      }
    },
    other_value: function(new_value, old_value) {
      this.$emit("change", new_value);
    },
    init_selected:  function(new_value, old_value) {
      this.selected = new_value;
    }
  },
  data: function() {
    return {
      options: null,
      selected: null,
      other_value: null,
    };
  },
  methods: {
    getElement(value) {
      if (this.options == null) {
        return {text: ""}
      }
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value === value) return this.options[i];
      }
      return null;
    },
    isContainValueIn(value) {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value === value) return true;
      }
      return false;
    }
  },
  mounted() {
    var vm = this;
    // Neu gia tri khoi tao khong nam trong danh sach cac key dua vao thi bat hien tai la
    // other va gan gia tri other do chinh la gia tri moi.
    this.options = JSON.parse(this.init_options);
    if(this.isContainValueIn(this.init_selected)) {
      this.selected = this.init_selected;
    } else {
      this.other_value = this.init_selected;
      this.selected = this.init_other_value;
    }
  }
})
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

//tạo hàm truyền tham trị
function copyUser(){

  var newUser = {
    id: 0,
    avatar: null,
    name: "Dũng Mori",
    email: "dungmori@gmail.com",
    username: null,
    birday: null,
    phone: "0969.86.84.85",
    nihongo: "N1",
    address: "19 Nguyễn Trãi Thanh Xuân Hà Nội",
    country: "Việt Nam"
  };

  return newUser;

}

//components hiển thị comments
Vue.component('comments', {

    template: `
    <div class="list-comments" :style="'background-color:'+ background">

      <div class="input-comment-container" v-if="meid != null">
        <p><b>Đăng bình luận</b></p>
        <div class="form_action">
            <img v-if="avatar == null || avatar == ''" class="me-avatar" :src="url + '/assets/img/default-avatar.jpg'">
            <img v-if="avatar != null && avatar != ''" class="me-avatar" :src="url + '/cdn/avatar/small/'+ avatar">
            <textarea class="input-comment" id="comment-content" rows="1" placeholder="comment..."></textarea>
            <span class="post-comment-btn" v-on:click="postNewComment">Đăng</span>
        </div>
      </div>

      <li v-if="showLoadingNewComment == true" class="comment-item" style='text-align: center;'>loading...</li>

      <li class="comment-item" v-for="cmt in listComments" :id="'cmt-item-'+ cmt.id">
        <a v-if="cmt.user_id == 0" class="pull-left avatar-container" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(cmt.user_id)">
          <img class="avatar" :src="url + '/assets/img/dmr-square-logo.png'">
          <i class="zmdi zmdi-check-circle"></i>
        </a>
        <a v-if="cmt.user_id != 0" class="pull-left avatar-container" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(cmt.user_id)">
          <img v-if="cmt.user_info.avatar == null || cmt.user_info.avatar == ''" class="avatar" :src="url + '/assets/img/default-avatar.jpg'">
          <img v-if="cmt.user_info.avatar != null && cmt.user_info.avatar != ''" class="avatar" :src="url + '/cdn/avatar/small/'+ cmt.user_info.avatar">
        </a>
        <div class="comment-content">
          <p class="name">
            <b class="red" v-if="cmt.user_id == 0" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(0)">Dũng Mori</b>
            <b class="red" v-if="cmt.user_id != 0" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(cmt.user_id)">
              {{cmt.user_info.name}}
            </b>
            <span v-html="printInfo(cmt.content)"></span>
          </p>
          <p class="comment-action">
            <span class="answer" data-toggle="collapse" :id="'answer-reply-'+ cmt.id" :href="'#reply-'+ cmt.id" aria-expanded="false" :aria-controls="'reply-'+ cmt.id">Trả lời</span> • 
            <span class="time">{{cmt.time_created}}</span>
          </p>
          <div class="reply-container">
            <a v-if="cmt.replies.length != 0" class="load-more-reply" role="button" data-toggle="collapse" :href="'#reply-'+ cmt.id" aria-expanded="false" :aria-controls="'reply-'+ cmt.id">
              <i class="zmdi zmdi-comments"></i> {{cmt.replies.length}} phản hồi
            </a>
            <div class="collapse" :id="'reply-'+ cmt.id">
              <div class="child-comment-item" v-for="(childCmt, index) in cmt.replies" :id="'reply-item-'+ childCmt.id">
                <a v-if="childCmt.user_id == 0" class="pull-left avatar-container" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(0)">
                  <img class="avatar" :src="url + '/assets/img/dmr-square-logo.png'">
                  <i class="zmdi zmdi-check-circle"></i>
                </a>
                <a v-if="childCmt.user_id != 0" class="pull-left avatar-container" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(childCmt.user_id)">
                  <img v-if="childCmt.user_info.avatar == null || childCmt.user_info.avatar == ''" class="avatar" :src="url + '/assets/img/default-avatar.jpg'">
                  <img v-if="childCmt.user_info.avatar != null && childCmt.user_info.avatar != ''" class="avatar" :src="url + '/cdn/avatar/small/'+ childCmt.user_info.avatar">
                </a>
                <div class="comment-content">
                  <p class="child-name">
                    <b class="red" v-if="childCmt.user_id == 0" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(0)">Dũng Mori </b>
                    <b class="red" v-if="childCmt.user_id != 0" data-fancybox data-src="#user-profile-popup" href="javascript:;" v-on:click="fetchUserInfo(childCmt.user_id)">
                      {{childCmt.user_info.name}}
                    </b>
                    <span v-html="printInfo(childCmt.content)"></span>
                  </p>
                  <p class="child-comment-action">
                    <span class="time">{{childCmt.time_created}}</span> 
                  </p>
                </div>
                <span v-if="meid == childCmt.user_id" class="delete-comment" v-on:click="delReply(childCmt.id)"><i class="zmdi zmdi-close-circle"></i> xóa</span>
              </div>

              <div class="reply-form" v-if="meid != null">
                <img v-if="avatar == null || avatar == ''" class="me-avatar" :src="url + '/assets/img/default-avatar.jpg'">
                <img v-if="avatar != null && avatar != ''" class="me-avatar" :src="url + '/cdn/avatar/small/'+ avatar">
                <textarea class="input-comment" :id="'reply-input-content-'+ cmt.id" rows="1" placeholder="comment..."></textarea>
                <span class="post-comment-btn" v-on:click="postNewAnswer(cmt.id)">Trả lời</span>
              </div>

            </div>
          </div>
        </div>
        <span v-if="meid == cmt.user_id" class="delete-comment" v-on:click="delComment(cmt.id)"><i class="zmdi zmdi-close-circle"></i> xóa</span>
      </li>

      <!-- hiển thị loading -->
      <div v-if="theEnd == false" class="load-more-comment" v-on:click="fetchMoreComments">
        <span v-show="showLoading == false">Tải thêm bình luận</span>
        <img class="loading-icon" v-show="showLoading == true" :src="url + '/assets/img/loading.gif'"/>
      </div>
      <div v-if="theEnd == true" class="end-of-list">Hết danh sách</div>

      <!-- hiển thị profile -->
      <div style="display: none;" id="user-profile-popup" class="user-profile-popup">
        <div class="user-profile-container" v-if="showLoadingUser == false">
          <div class="loading-circle" style="margin-top: 150px;"></div>
        </div>
        <div class="user-profile-container" v-if="showLoadingUser == true">
          <div v-if="currentUser.id == 0" class="cover-container">
            <img class="user-avatar" :src="url + '/assets/img/dmr-square-logo.png'"/>
          </div>
          <div v-if="currentUser.id != 0" class="cover-container">
            <img v-if="currentUser.avatar == null || currentUser.avatar == ''" class="user-avatar" :src="url + '/assets/img/default-avatar.jpg'">
            <img v-if="currentUser.avatar != null && currentUser.avatar != ''" class="user-avatar" :src="url + '/cdn/avatar/default/'+ currentUser.avatar">
          </div>
          <table class="table" id="user-info-table">
            <tbody>
            <tr v-if="currentUser.name != null && currentUser.name != ''">
                <td class="user-form-item desc" style="width: 130px;">Họ và Tên</td>
                <td class="user-form-item">
                  <b>{{currentUser.name}}</b>
                  <i v-if="currentUser.id == 0" style="color: #578fff;" class="zmdi zmdi-check-circle" data-toggle="tooltip" data-placement="left" title="Tài khoản đã xác thực"></i>
                </td>
             </tr>
             <tr v-if="currentUser.email != null && currentUser.email != ''">
                <td class="user-form-item desc">Email</td>
                <td class="user-form-item"><span class="info-item-email">{{currentUser.email}}</span></td>
             </tr>
             <tr v-if="currentUser.username != null && currentUser.username != ''">
                <td class="user-form-item desc">Tên đăng nhập</td>
                <td class="user-form-item"><span>{{currentUser.username}}</span></td>
             </tr>
             <tr v-if="currentUser.birthday != null && currentUser.birthday != ''">
                <td class="user-form-item desc">Ngày sinh</td>
                <td class="user-form-item">{{currentUser.birthday}}</td>
             </tr>
             <tr v-if="currentUser.phone != null && currentUser.phone != ''">
                <td class="user-form-item desc">Số điện thoại</td>
                <td class="user-form-item"><span>{{currentUser.phone}}</span></td>
             </tr>
             <tr v-if="currentUser.nihongo != null && currentUser.nihongo != ''">
                <td class="user-form-item desc">Trình tiếng Nhật</td>
                <td class="user-form-item">{{currentUser.nihongo}}</td>
             </tr>
             <tr v-if="currentUser.address != null && currentUser.address != ''">
                <td class="user-form-item desc">Địa chỉ</td>
                <td class="user-form-item" style="padding-right:0;"><span>{{currentUser.address}}</span></td>
             </tr>
             <tr v-if="currentUser.country != null && currentUser.country != ''">
                <td class="user-form-item desc">Quốc gia</td>
                <td class="user-form-item">{{currentUser.country}}</td>
             </tr>
          </tbody>
       </table>
        </div>
      </div>

    </div>
    `,

    props: ['meid', 'avatar', 'tbid', 'tbname', 'numPosts', 'background'],

    data: function () {
        return {

            url: window.location.origin, //đường dẫn host
            listComments: [],    //sanh sách các comments
            page: 1,             //trang thứ mấy
            numPost: 15,
            ref: null, //nguồn chuyển hướng (notice hoặc 0)

            showLoading: false,  //trạng thái hiển thị button tải thêm
            theEnd: false,       //thông báo hết danh sách

            showLoadingUser: false,  //trạng thái tải thông tin người dùng
            currentUser: copyUser(), //preview profile người dùng

            showLoadingNewComment: false
        };
    },

    methods: {

        //in ra thông tin có dấu cách
        printInfo: function(info){
          return info.replace(new RegExp('\r?\n','g'), '<br />');
        },

        //tải về các comments cho lần tải đầu tiên
        fetchlistComments: function() {

          vm = this;

          //focus vào comment được đánh dấu
          var url = new URL(window.location.href);
          if(url.searchParams.get("ref") != null)
            vm.ref = "notice";

          data = {
            id: vm.tbid,
            name: vm.tbname,
            numpost: vm.numPost,
            ref: vm.ref
          };
          $.post(window.location.origin +"/api/comments/comments-load-first", data, function(response, status){

            //console.log(response);

            vm.listComments = response.comments;
            //console.log(vm.listComments);

            //nếu đã hết danh sách
            if(response.comments.length < vm.numPost) vm.theEnd = true;
            
            //ẩn biểu tượng loading
            vm.showLoading = false;

            //focus vào comment được đánh dấu
            var url = new URL(window.location.href);
            var focus = url.searchParams.get("focus");
            if(focus != null){
              console.log("focus: "+ focus);
              setTimeout(function(){

                $("#answer-reply-"+ focus).click();

                //cuộn trang tới vị trí dc focus
                $('html, body').animate({
                    scrollTop: $("#answer-reply-"+ focus).offset().top - 120
                }, 200);

              }, 500);
            }

            

          });
        },

        //tải các phản hồi
        fetchMoreComments: function(){

          vm = this;

          //hiện biểu tượng loading
          vm.showLoading = true;

          setTimeout(function(){
            data = {
              id  : vm.tbid,
              name: vm.tbname,
              numpost: vm.numPost,
              page: vm.page++
            };
            //console.log(data);
            $.post(window.location.origin +"/api/comments/comments-load-more", data, function(response, status){

              //nối thêm mảng tải thêm
              vm.listComments = vm.listComments.concat(response.comments);

              //nếu đã hết danh sách
              if(response.comments.length < vm.numPost) vm.theEnd = true;

              //ẩn biểu tượng loading
              vm.showLoading = false;
              
            });

          }, 500);

          //console.log('tải thêm các bình luận');

        },

        //tải thông tin user
        fetchUserInfo: function(id){

          console.log('preview thông tin người dùng '+ id);
          vm = this;
          vm.showLoadingUser = false;

          //console.log(defaultUser);
          setTimeout(function(){
            if(id == 0) {

                vm.currentUser = copyUser();
                console.log(vm.currentUser);
                vm.showLoadingUser = true;
            }
            else{

              console.log(data);
              $.post(window.location.origin +"/api/profile/get-profile-by-id", {id: id}, function(response, status){

                console.log(response);
                vm.currentUser.id     = response.id;
                vm.currentUser.avatar = response.avatar;
                vm.currentUser.name   = response.name;
                vm.currentUser.email  = response.email;
                vm.currentUser.username = response.username;
                vm.currentUser.birday   = response.birday;
                vm.currentUser.phone    = response.phone;
                vm.currentUser.nihongo  = response.japanese_level;
                vm.currentUser.address  = response.address;
                vm.currentUser.country  = "Việt Nam";

                vm.showLoadingUser = true;

              });
            }
          }, 600);
        },

        //đăng bình luận mới
        postNewComment: function(){
            // bỏ qua comment rỗng
            if ($("#comment-content").val() == null || $("#comment-content").val() == undefined || $("#comment-content").val().trim() == "") {
                return;
            }

          vm.showLoadingNewComment = true;

          //console.log("đăng bình luận");
          setTimeout(function(){
            data = {
              tbid    : vm.tbid,
              tbname  : vm.tbname,
              content : $("#comment-content").val()
            };
            //console.log(data);
            $.post(window.location.origin +"/api/comments/add-new-comment", data, function(response, status){

              console.log(response);
              vm.listComments.unshift(response);
              $("#comment-content").val('');
              $("#comment-content").css('height', '42px');
              
              vm.showLoadingNewComment = false;

            });
          }, 500);
        },

        //xóa comment theo id
        delComment: function(id){
          setTimeout(function(){
            $.post(window.location.origin +"/api/comments/delete-comment", {id: id}, function(response, status){
              if(response == "success"){
                $("#cmt-item-"+id).fadeOut();
              }else{
                alert("thao tác không hợp lệ");
              }
            });
          }, 500);
        },

        //đăng reply mới
        postNewAnswer: function(parent_id ){
            // bỏ qua comment rỗng
            if ($("#reply-input-content-"+ parent_id).val() == null || $("#reply-input-content-"+ parent_id).val() == undefined || $("#reply-input-content-"+ parent_id).val().trim() == "") {
                return;
            }
          setTimeout(function(){
            data = {
              tbid    : vm.tbid,
              tbname  : vm.tbname,
              parent_id : parent_id,
              content   : $("#reply-input-content-"+ parent_id).val()
            };
            $.post(window.location.origin +"/api/comments/add-new-reply", data, function(response, status){

              var indexOfComment = 0; //thứ tự của comment đang reply
              for(var i=0; i<vm.listComments.length; i++) if(vm.listComments[i].id == parent_id)  indexOfComment = i;

              //console.log(indexOfComment);
              vm.listComments[indexOfComment].replies.push(response);
              $("#reply-input-content-"+ parent_id).val('');

              // $("#comment-content").css('height', '42px');
              // vm.showLoadingNewComment = false;

            });
          }, 500);
        },

        //xóa reply theo id
        delReply: function(id){
          setTimeout(function(){
            $.post(window.location.origin +"/api/comments/delete-comment", {id: id}, function(response, status){
              if(response == "success"){
                $("#reply-item-"+id).fadeOut();
              }else{
                alert("thao tác không hợp lệ");
              }
            });
          }, 500);
        },
    },

    mounted: function () {

        //nếu là giao diện mobile chỉ load 4 items
        if(screen.width < 800) this.numPost = 4;

        this.fetchlistComments();
    }

})
//# sourceMappingURL=components.js.map
