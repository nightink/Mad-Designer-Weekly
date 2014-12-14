

angular.module('app')
  .factory('Week', function($timeout) {

    function Week(args) {
      this.el = angular.element(args.el);
      this.title = args.title;
      this.cols = args.cols;
      this.rows = args.rows || [{}];
    }

    Week.prototype.addRow = function($index) {
      this.rows.splice($index + 1, 0, {});
      this.focusRow($index + 1);
      return this;
    };

    Week.prototype.delRow = function($index) {
      if (this.rows.length === 1) {
        return;
      }

      this.rows.splice($index, 1);
      this.focusRow($index - 1 > -1 ? $index - 1 : 0);
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

      return self;
    };

    Week.prototype.leftCell = function(rowIndex, colIndex) {
      if (colIndex === 0) {
        if (rowIndex === 0) {
          return;
        }

        rowIndex--;
        colIndex = this.cols.length - 1;
      } else {

        colIndex--;
      }

      return this.focusRow(rowIndex, colIndex);
    }

    Week.prototype.rightCell = function(rowIndex, colIndex) {
      if (colIndex === this.cols.length - 1) {
        if (rowIndex === this.rows.length - 1) {
          return;
        }

        rowIndex++;
        colIndex = 0;
      } else {

        colIndex++;
      }

      return this.focusRow(rowIndex, colIndex);
    }

    Week.prototype.upCell = function(rowIndex, colIndex) {
      if (rowIndex === 0) {
        return;
      }

      rowIndex--;
      return this.focusRow(rowIndex, colIndex);
    }

    Week.prototype.downCell = function(rowIndex, colIndex) {
      if (rowIndex === this.rows.length - 1) {
        return;
      }

      rowIndex++;
      return this.focusRow(rowIndex, colIndex);
    }

    // 继续简单粗暴的做法，可以考虑用非字符串拼接的方式实现
    Week.prototype.toMarkdown = function() {
      var markdown = this.markdown = ' ';

      // title
      markdown += '### ';
      markdown += this.title;
      markdown += ' \n\n ';

      // columns
      markdown += ' | ';
      this.cols.forEach(function(col) {
        markdown += col.text;
        markdown += ' | ';
      })

      markdown += ' \n ';
      markdown += ' | ';
      this.cols.forEach(function(col) {
        markdown += '------';
        markdown += ' | ';
      })

      // rows
      var temp = [];
      angular.copy(this.rows).forEach(function(row) {
        temp = [];
        for (var cell in row) {
          if (row.hasOwnProperty(cell)) {
            temp[cell.charAt(cell.length - 1)] = row[cell];
          }
        }

        markdown += ' \n ';
        markdown += ' | ';
        temp.forEach(function(t) {
          markdown += t;
          markdown += ' | ';
        });
      });

      return markdown
    };

    return Week;
  })
