'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngSanitize',
    'ngMaterial',
    'ngClipboard'
  ])
  .config(function(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  })
  .controller('MainCtrl', function($scope, $mdToast, Week, Thought) {

    $scope.thisWeek = new Week({
      el: document.getElementById('thisWeek'),
      title: '个人参与项目',
      cols: [{text: '工作任务'}, {text: '参与人', width: 200}, {text: '工作完成进度', width: 150}, {text: '耗时', width: 150}]
    });

    $scope.nextWeek = new Week({
      el: document.getElementById('nextWeek'),
      title: '下周计划',
      cols: [{text: '工作任务'}, {text: '预计时间'}]
    });

    $scope.thoughts = new Thought({
      title: '感想',
      content: ''
    });

    function getWeek(week) {
      if (week === 'thisWeek') {
        return $scope.thisWeek;
      } else if (week === 'nextWeek') {
        return $scope.nextWeek;
      }
    }

    $scope.keyboard = {
      buffer: [],
      detectCombination: function() {
        var codes = {};

        this.buffer.forEach(function(code) {
          codes['key_' + code] = 1;
        })

        if ((codes.key_91 || codes.key_93) && codes.key_8) {
          return 'command + delete';
        }
      },
      keydown: function($event, week, rowIndex, cellIndex) {
        var keyCode = $event.keyCode;

        if (keyCode == 13) {
          getWeek(week).addRow(rowIndex)

        } else if (keyCode > 36 && keyCode < 41) {

          switch (keyCode) {
            case 37:
              getWeek(week).leftCell(rowIndex, cellIndex);
              break;
            case 38:
              getWeek(week).upCell(rowIndex, cellIndex);
              break;
            case 39:
              getWeek(week).rightCell(rowIndex, cellIndex);
              break;
            case 40:
              getWeek(week).downCell(rowIndex, cellIndex);
              break;
            default:
              break;
          }

        } else {
          this.buffer.push(keyCode);

          if (this.detectCombination() === 'command + delete') {
            getWeek(week).delRow(rowIndex)
          }
        }
      },
      keyup: function($event, week) {
        this.buffer = [];
      }
    };

    $scope.generate = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Markdown 已复制至剪切板!')
          .position('top right')
          .hideDelay(1500)
      );

      // to makrdown
      $scope.markdown =
        $scope.thisWeek.toMarkdown() + ' \n\n ' +
        $scope.nextWeek.toMarkdown() + ' \n\n ' +
        $scope.thoughts.toMarkdown();

      return $scope.markdown;
    }

  })
