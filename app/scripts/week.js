

angular.module('app')
  .factory('Week', function($timeout) {

    function Week(args) {
      this.el = angular.element(args.el);
      this.title = args.title;
      this.cols = args.cols;
      this.rows = args.rows || [{}];
    }

    Week.prototype.addRow = function() {
      this.rows.push({});
      this.focusRow(this.rows.length - 1);
      return this;
    };

    Week.prototype.delRow = function($index) {
      if (this.rows.length === 1) {
        return;
      }

      this.rows.splice($index, 1);
      this.focusRow($index - 1);
      return this;
    };

    // 简单粗暴的做法。如果要需求更好的做法，需要写一个Week的DI
    Week.prototype.focusRow = function(rowIndex, colIndex) {
      var self = this;
      colIndex = colIndex || 0;

      $timeout(function() {
        self.el
            .find('tbody')
            .find('tr')
            .eq(rowIndex)
            .find('input')
            .eq(colIndex)
            .focus();
      }, 0)
    }

    return Week;
  })
