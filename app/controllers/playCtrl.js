angular.module('playCtrl', [])
  .controller('PlayController', function ($scope, $rootScope, Play,$sce) {

    $scope.videos = [];
    $scope.subreddits = ["videos", "deepIntoYouTube", "documentaries", "music", "gaming", "ted", "woahTube", "asmr", "contagiousLaughter", "wtf"];
    $scope.sr = "";
    $scope.getVideosFromSubreddit = function (subreddit, type, limit){
      Play.getVideosFromSubreddit(subreddit, type, limit)
        .success(function (data) {
          $scope.videos = [];
          createVideoList(data.data.children);
          if($scope.videos.length!=0){
            $scope.playVideoUrl =  $sce.trustAsHtml($scope.videos[0].embedHtml);
            $scope.playVideoTitle = $scope.videos[0].title;
            $scope.playVideoSource = $scope.videos[0].provider;
            $scope.playVideoRedditLink = $scope.videos[0].redditLink;
          }
            
          else
            $scope.playVideoUrl =  $sce.trustAsHtml('<h1>No videos in this subreddit :(</h1>');
        });
    };

    $scope.playVideo = function (video) {
      $scope.playVideoUrl = $sce.trustAsHtml(video.embedHtml);
      $scope.playVideoTitle = video.title;
      $scope.playVideoSource = video.provider;
      $scope.playVideoRedditLink = video.redditLink;
    };

    var createVideoList = function (children) {
      for(i=0; i<children.length; i++){
        child = children[i];
        temp = {};
        if(child.data.media != null){
          if(child.data.media.oembed.type == 'video'){
            temp['thumbnailUrl'] = child.data.media.oembed.thumbnail_url;
            embedHtml = document.createElement('div');
            embedHtml.innerHTML = child.data.media.oembed.html;
            temp['embedHtml'] = embedHtml.textContent;
            temp['title'] = child.data.title;
            temp['provider'] = child.data.media.oembed.provider_name;
            temp['redditLink'] = "https://www.reddit.com" + child.data.permalink;
            $scope.videos.push(temp);
          }
        }
      }
    };

    $scope.addSubreddit = function () {
      $scope.subreddits.push($scope.sr);
      $scope.getVideosFromSubreddit($scope.sr, 'hot', 100);
      $scope.sr = ""
    };

    //onload default
    $scope.getVideosFromSubreddit('videos', 'hot', 100)

  });